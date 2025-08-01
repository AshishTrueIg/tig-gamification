// Practical Example: How Automation Works

// 1. User makes a deposit event
const depositEvent = {
  type: 'deposit',
  userId: 123,
  amount: 1500,
  timestamp: '2024-01-15T10:30:00Z'
};

// 2. Event processor updates user profile
async function updateUserProfile(event) {
  if (event.type === 'deposit') {
    await db.query(`
      UPDATE users 
      SET total_deposits = total_deposits + $1,
          last_deposit_date = $2,
          updated_at = NOW()
      WHERE id = $3
    `, [event.amount, event.timestamp, event.userId]);
  }
}

// 3. Segment evaluation checks if user now qualifies for "High Roller" segment
async function evaluateHighRollerSegment(userId) {
  const user = await db.query(`
    SELECT total_deposits, last_deposit_date 
    FROM users 
    WHERE id = $1
  `, [userId]);
  
  const highRollerRules = {
    type: 'deposit_threshold',
    threshold: 1000
  };
  
  // Check if user qualifies
  const qualifies = user.total_deposits > highRollerRules.threshold &&
                   user.last_deposit_date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  return qualifies;
}

// 4. If user enters High Roller segment, trigger campaign
async function handleSegmentEntry(userId, segmentId) {
  // Check if user was already in this segment
  const existingMembership = await db.query(`
    SELECT id FROM user_segments 
    WHERE user_id = $1 AND segment_id = $2
  `, [userId, segmentId]);
  
  if (existingMembership.length === 0) {
    // User is entering segment for the first time
    await db.query(`
      INSERT INTO user_segments (user_id, segment_id) 
      VALUES ($1, $2)
    `, [userId, segmentId]);
    
    // Trigger campaigns for this segment
    await triggerSegmentCampaigns(userId, segmentId);
  }
}

// 5. Campaign automation finds active campaigns for this segment
async function triggerSegmentCampaigns(userId, segmentId) {
  const campaigns = await db.query(`
    SELECT * FROM campaigns 
    WHERE segment_id = $1 AND is_active = true
  `, [segmentId]);
  
  for (const campaign of campaigns) {
    if (await shouldTriggerCampaign(userId, campaign)) {
      await queueCampaignEmail(userId, campaign);
    }
  }
}

// 6. Check if campaign should be triggered
async function shouldTriggerCampaign(userId, campaign) {
  // Check if already sent
  const alreadySent = await db.query(`
    SELECT id FROM campaign_logs 
    WHERE user_id = $1 AND campaign_id = $2
  `, [userId, campaign.id]);
  
  if (alreadySent.length > 0) {
    return false; // Already sent
  }
  
  // Check user email preferences
  const user = await db.query(`
    SELECT email_opt_in FROM users WHERE id = $1
  `, [userId]);
  
  if (!user.email_opt_in) {
    return false; // User opted out
  }
  
  return true; // Should trigger
}

// 7. Queue the email job
async function queueCampaignEmail(userId, campaign) {
  const user = await db.query(`
    SELECT * FROM users WHERE id = $1
  `, [userId]);
  
  const template = await db.query(`
    SELECT * FROM email_templates WHERE id = $1
  `, [campaign.template_id]);
  
  const jobData = {
    userId,
    campaignId: campaign.id,
    segmentId: campaign.segment_id,
    template: template,
    userData: user,
    sendAt: new Date()
  };
  
  // Add to BullMQ queue
  await emailQueue.add('send-campaign-email', jobData, {
    jobId: `${userId}_${campaign.id}_${Date.now()}`,
    delay: campaign.send_delay || 0
  });
  
  // Log the trigger
  await db.query(`
    INSERT INTO campaign_logs (user_id, campaign_id, segment_id, status)
    VALUES ($1, $2, $3, 'queued')
  `, [userId, campaign.id, campaign.segment_id]);
}

// 8. Worker processes the email job
async function processEmailJob(job) {
  const { userId, campaignId, template, userData } = job.data;
  
  try {
    // Render template with user data
    const emailContent = renderTemplate(template, userData);
    
    // Send via SendGrid
    const result = await sendGrid.send({
      to: userData.email,
      from: template.from_email,
      subject: emailContent.subject,
      html: emailContent.html,
      customArgs: {
        campaignId,
        userId,
        segmentId: job.data.segmentId
      }
    });
    
    // Update log with success
    await db.query(`
      UPDATE campaign_logs 
      SET status = 'sent', email_message_id = $1
      WHERE user_id = $2 AND campaign_id = $3
    `, [result.messageId, userId, campaignId]);
    
  } catch (error) {
    // Update log with failure
    await db.query(`
      UPDATE campaign_logs 
      SET status = 'failed'
      WHERE user_id = $1 AND campaign_id = $2
    `, [userId, campaignId]);
    
    throw error; // BullMQ will retry
  }
}

// 9. Template rendering with user data
function renderTemplate(template, userData) {
  let html = template.html;
  let subject = template.subject;
  
  // Replace placeholders
  const replacements = {
    '{{first_name}}': userData.first_name || 'Player',
    '{{total_deposits}}': userData.total_deposits || 0,
    '{{vip_tier}}': userData.vip_tier || 'Bronze'
  };
  
  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(placeholder, 'g'), value);
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return { html, subject };
}

// Example email template for High Roller welcome
const highRollerTemplate = {
  subject: 'Welcome to the High Roller Club, {{first_name}}!',
  html: `
    <h1>Congratulations {{first_name}}!</h1>
    <p>You've joined our exclusive High Roller Club with total deposits of ${{total_deposits}}.</p>
    <p>As a VIP member, you'll receive:</p>
    <ul>
      <li>Exclusive bonuses and promotions</li>
      <li>Priority customer support</li>
      <li>Special tournament access</li>
    </ul>
    <p>Start playing now to unlock even more rewards!</p>
  `
};

// Complete flow example:
async function completeAutomationFlow() {
  // 1. User makes deposit
  const event = {
    type: 'deposit',
    userId: 123,
    amount: 1500,
    timestamp: new Date().toISOString()
  };
  
  // 2. Process event
  await updateUserProfile(event);
  
  // 3. Check segments
  const qualifiesForHighRoller = await evaluateHighRollerSegment(event.userId);
  
  if (qualifiesForHighRoller) {
    // 4. Handle segment entry
    await handleSegmentEntry(event.userId, 1); // segment ID 1 = High Roller
    
    // 5. This automatically triggers the "Welcome High Roller" campaign
    // 6. Email gets queued and sent via BullMQ worker
    // 7. User receives personalized welcome email
  }
}

// This automation ensures that:
// - Every time a user makes a deposit, their profile is updated
// - If they cross the $1000 threshold, they automatically enter the High Roller segment
// - When they enter the segment, the welcome campaign is automatically triggered
// - The email is personalized with their name and deposit amount
// - Everything is logged and tracked for analytics