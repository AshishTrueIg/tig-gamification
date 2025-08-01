# Automated CRM Campaign System for iGaming

## Overview
This system automatically triggers email campaigns when users enter segments, using real-time event processing with BullMQ, PostgreSQL, and Redis.

## Architecture Components

### 1. Event-Driven Segment Evaluation
```javascript
// Event processor that updates segments in real-time
class EventProcessor {
  async processEvent(event) {
    // 1. Update user profile with new event data
    await this.updateUserProfile(event);
    
    // 2. Evaluate all segments for this user
    const newSegments = await this.evaluateSegments(event.userId);
    
    // 3. Check for segment changes and trigger campaigns
    await this.handleSegmentChanges(event.userId, newSegments);
  }
}
```

### 2. Real-Time Segment Evaluation
```javascript
// Segment evaluation service
class SegmentService {
  async evaluateSegments(userId) {
    const user = await this.getUserProfile(userId);
    const segments = await this.getAllSegments();
    const userSegments = [];
    
    for (const segment of segments) {
      if (await this.evaluateSegmentRules(segment, user)) {
        userSegments.push(segment.id);
      }
    }
    
    return userSegments;
  }
  
  async evaluateSegmentRules(segment, user) {
    // Example: "High Roller" segment
    // Rules: total_deposits > 1000 AND last_deposit_date < 30 days ago
    const rules = segment.rules;
    
    if (rules.type === 'deposit_threshold') {
      return user.totalDeposits > rules.threshold && 
             user.lastDepositDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    
    if (rules.type === 'login_frequency') {
      return user.loginCount >= rules.minLogins && 
             user.lastLoginDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    
    // Add more rule types as needed
    return false;
  }
}
```

### 3. Campaign Automation Engine
```javascript
// Campaign automation service
class CampaignAutomationService {
  async handleSegmentChanges(userId, newSegments) {
    const previousSegments = await this.getUserSegments(userId);
    const enteredSegments = newSegments.filter(s => !previousSegments.includes(s));
    
    // Trigger campaigns for newly entered segments
    for (const segmentId of enteredSegments) {
      await this.triggerSegmentCampaigns(userId, segmentId);
    }
    
    // Update user's current segments
    await this.updateUserSegments(userId, newSegments);
  }
  
  async triggerSegmentCampaigns(userId, segmentId) {
    const campaigns = await this.getActiveCampaignsForSegment(segmentId);
    
    for (const campaign of campaigns) {
      if (await this.shouldTriggerCampaign(userId, campaign)) {
        await this.queueCampaignEmail(userId, campaign);
      }
    }
  }
  
  async shouldTriggerCampaign(userId, campaign) {
    // Check if user already received this campaign
    const alreadySent = await this.checkCampaignSent(userId, campaign.id);
    if (alreadySent) return false;
    
    // Check campaign frequency limits
    const recentSends = await this.getRecentCampaignSends(userId, campaign.id);
    if (recentSends.length >= campaign.frequencyLimit) return false;
    
    // Check user preferences
    const userPrefs = await this.getUserPreferences(userId);
    if (!userPrefs.emailOptIn) return false;
    
    return true;
  }
}
```

### 4. Queue-Based Email System
```javascript
// Email queue service using BullMQ
class EmailQueueService {
  constructor() {
    this.emailQueue = new Queue('email-campaigns', {
      connection: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    });
  }
  
  async queueCampaignEmail(userId, campaign) {
    const user = await this.getUserProfile(userId);
    const template = await this.getEmailTemplate(campaign.templateId);
    
    const jobData = {
      userId,
      campaignId: campaign.id,
      segmentId: campaign.segmentId,
      template: template,
      userData: user,
      sendAt: campaign.sendDelay ? new Date(Date.now() + campaign.sendDelay) : new Date()
    };
    
    const jobOptions = {
      jobId: `${userId}_${campaign.id}_${Date.now()}`,
      delay: campaign.sendDelay || 0
    };
    
    await this.emailQueue.add('send-campaign-email', jobData, jobOptions);
    
    // Log campaign trigger
    await this.logCampaignTrigger(userId, campaign.id);
  }
}
```

### 5. Email Worker
```javascript
// BullMQ worker for processing email jobs
class EmailWorker {
  constructor() {
    this.worker = new Worker('email-campaigns', async (job) => {
      await this.processEmailJob(job);
    }, {
      connection: redisConfig,
      concurrency: 10
    });
    
    this.setupWorkerEvents();
  }
  
  async processEmailJob(job) {
    const { userId, campaignId, template, userData } = job.data;
    
    try {
      // Render email template with user data
      const emailContent = await this.renderTemplate(template, userData);
      
      // Send via SendGrid
      const result = await this.sendEmail({
        to: userData.email,
        from: template.fromEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        customArgs: {
          campaignId,
          userId,
          segmentId: job.data.segmentId
        }
      });
      
      // Log successful send
      await this.logEmailSent(userId, campaignId, result.messageId);
      
    } catch (error) {
      console.error(`Email job failed for user ${userId}:`, error);
      throw error; // BullMQ will retry
    }
  }
  
  async renderTemplate(template, userData) {
    // Replace placeholders with user data
    let html = template.html;
    let subject = template.subject;
    
    // Replace common placeholders
    const replacements = {
      '{{first_name}}': userData.firstName || 'Player',
      '{{total_deposits}}': userData.totalDeposits || 0,
      '{{vip_tier}}': userData.vipTier || 'Bronze',
      '{{last_login_date}}': userData.lastLoginDate ? new Date(userData.lastLoginDate).toLocaleDateString() : 'Never'
    };
    
    for (const [placeholder, value] of Object.entries(replacements)) {
      html = html.replace(new RegExp(placeholder, 'g'), value);
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return { html, subject };
  }
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  total_deposits DECIMAL(10,2) DEFAULT 0,
  total_withdrawals DECIMAL(10,2) DEFAULT 0,
  login_count INTEGER DEFAULT 0,
  last_login_date TIMESTAMP,
  vip_tier VARCHAR(50) DEFAULT 'Bronze',
  email_opt_in BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Segments Table
```sql
CREATE TABLE segments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  rules JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### User Segments Table
```sql
CREATE TABLE user_segments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  segment_id INTEGER REFERENCES segments(id),
  entered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, segment_id)
);
```

### Campaigns Table
```sql
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  segment_id INTEGER REFERENCES segments(id),
  template_id INTEGER REFERENCES email_templates(id),
  send_delay INTEGER DEFAULT 0, -- milliseconds
  frequency_limit INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Email Templates Table
```sql
CREATE TABLE email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html TEXT NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Campaign Logs Table
```sql
CREATE TABLE campaign_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  campaign_id INTEGER REFERENCES campaigns(id),
  segment_id INTEGER REFERENCES segments(id),
  email_message_id VARCHAR(255),
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'sent'
);
```

## Implementation Steps

### Step 1: Set up Event Processing
```javascript
// Main event handler
app.post('/api/events', async (req, res) => {
  const event = req.body;
  
  try {
    await eventProcessor.processEvent(event);
    res.json({ success: true });
  } catch (error) {
    console.error('Event processing failed:', error);
    res.status(500).json({ error: 'Event processing failed' });
  }
});
```

### Step 2: Create Sample Segments
```javascript
// Example segments
const segments = [
  {
    name: 'High Rollers',
    rules: {
      type: 'deposit_threshold',
      threshold: 1000
    }
  },
  {
    name: 'Active Players',
    rules: {
      type: 'login_frequency',
      minLogins: 5,
      daysWindow: 7
    }
  },
  {
    name: 'VIP Members',
    rules: {
      type: 'vip_tier',
      minTier: 'Gold'
    }
  }
];
```

### Step 3: Create Sample Campaigns
```javascript
// Example campaigns
const campaigns = [
  {
    name: 'Welcome High Roller',
    segmentId: 1, // High Rollers
    templateId: 1,
    sendDelay: 0
  },
  {
    name: 'VIP Upgrade Congratulations',
    segmentId: 3, // VIP Members
    templateId: 2,
    sendDelay: 0
  }
];
```

## Usage Examples

### Triggering Events
```javascript
// When user makes a deposit
await fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'deposit',
    userId: 123,
    amount: 1500,
    timestamp: new Date().toISOString()
  })
});

// When user logs in
await fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'login',
    userId: 123,
    timestamp: new Date().toISOString()
  })
});
```

### Monitoring Campaign Performance
```javascript
// Get campaign statistics
const stats = await db.query(`
  SELECT 
    c.name as campaign_name,
    COUNT(cl.id) as emails_sent,
    COUNT(CASE WHEN cl.status = 'opened' THEN 1 END) as emails_opened
  FROM campaigns c
  LEFT JOIN campaign_logs cl ON c.id = cl.campaign_id
  WHERE c.is_active = true
  GROUP BY c.id, c.name
`);
```

## Key Benefits

1. **Automatic Triggering**: Campaigns fire automatically when users enter segments
2. **Real-Time Processing**: Events are processed immediately
3. **Scalable**: BullMQ handles high-volume email processing
4. **Reliable**: Built-in retry logic and error handling
5. **Flexible**: Easy to add new segments and campaigns
6. **Trackable**: Complete audit trail of all campaign activities

This system provides the automation you need while maintaining the flexibility to add new segments and campaigns as your business grows.