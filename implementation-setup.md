# Implementation Setup Guide for Automated CRM

## Prerequisites
- Node.js with BullMQ, PostgreSQL, Redis, Socket.io
- SendGrid account configured
- Existing user database

## Step 1: Install Dependencies

```bash
npm install bullmq redis pg socket.io @sendgrid/mail
```

## Step 2: Database Setup

### Create Tables
```sql
-- Users table (extend your existing users table)
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_deposits DECIMAL(10,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_withdrawals DECIMAL(10,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_deposit_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS vip_tier VARCHAR(50) DEFAULT 'Bronze';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_opt_in BOOLEAN DEFAULT true;

-- Segments table
CREATE TABLE segments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  rules JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User segments table
CREATE TABLE user_segments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  segment_id INTEGER REFERENCES segments(id),
  entered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, segment_id)
);

-- Campaigns table
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  segment_id INTEGER REFERENCES segments(id),
  template_id INTEGER REFERENCES email_templates(id),
  send_delay INTEGER DEFAULT 0,
  frequency_limit INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email templates table
CREATE TABLE email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html TEXT NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Campaign logs table
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

## Step 3: Create Core Services

### 1. Database Connection
```javascript
// config/database.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
```

### 2. Redis Configuration
```javascript
// config/redis.js
const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis;
```

### 3. Event Processor
```javascript
// services/EventProcessor.js
const db = require('../config/database');
const SegmentService = require('./SegmentService');
const CampaignAutomationService = require('./CampaignAutomationService');

class EventProcessor {
  constructor() {
    this.segmentService = new SegmentService();
    this.campaignService = new CampaignAutomationService();
  }

  async processEvent(event) {
    try {
      // 1. Update user profile
      await this.updateUserProfile(event);
      
      // 2. Evaluate segments
      const newSegments = await this.segmentService.evaluateSegments(event.userId);
      
      // 3. Handle segment changes and trigger campaigns
      await this.campaignService.handleSegmentChanges(event.userId, newSegments);
      
      console.log(`Event processed: ${event.type} for user ${event.userId}`);
    } catch (error) {
      console.error('Event processing failed:', error);
      throw error;
    }
  }

  async updateUserProfile(event) {
    switch (event.type) {
      case 'login':
        await db.query(`
          UPDATE users 
          SET login_count = login_count + 1,
              last_login_date = $1,
              updated_at = NOW()
          WHERE id = $2
        `, [event.timestamp, event.userId]);
        break;
        
      case 'deposit':
        await db.query(`
          UPDATE users 
          SET total_deposits = total_deposits + $1,
              last_deposit_date = $1,
              updated_at = NOW()
          WHERE id = $2
        `, [event.amount, event.userId]);
        break;
        
      case 'withdrawal':
        await db.query(`
          UPDATE users 
          SET total_withdrawals = total_withdrawals + $1,
              updated_at = NOW()
          WHERE id = $2
        `, [event.amount, event.userId]);
        break;
        
      case 'vip_upgrade':
        await db.query(`
          UPDATE users 
          SET vip_tier = $1,
              updated_at = NOW()
          WHERE id = $2
        `, [event.newTier, event.userId]);
        break;
    }
  }
}

module.exports = EventProcessor;
```

### 4. Segment Service
```javascript
// services/SegmentService.js
const db = require('../config/database');

class SegmentService {
  async evaluateSegments(userId) {
    const user = await this.getUserProfile(userId);
    const segments = await this.getAllActiveSegments();
    const userSegments = [];
    
    for (const segment of segments) {
      if (await this.evaluateSegmentRules(segment, user)) {
        userSegments.push(segment.id);
      }
    }
    
    return userSegments;
  }

  async getUserProfile(userId) {
    const result = await db.query(`
      SELECT * FROM users WHERE id = $1
    `, [userId]);
    return result.rows[0];
  }

  async getAllActiveSegments() {
    const result = await db.query(`
      SELECT * FROM segments WHERE is_active = true
    `);
    return result.rows;
  }

  async evaluateSegmentRules(segment, user) {
    const rules = segment.rules;
    
    switch (rules.type) {
      case 'deposit_threshold':
        return user.total_deposits >= rules.threshold &&
               user.last_deposit_date > new Date(Date.now() - (rules.daysWindow || 30) * 24 * 60 * 60 * 1000);
               
      case 'login_frequency':
        return user.login_count >= rules.minLogins &&
               user.last_login_date > new Date(Date.now() - (rules.daysWindow || 7) * 24 * 60 * 60 * 1000);
               
      case 'vip_tier':
        const tierOrder = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
        const userTierIndex = tierOrder.indexOf(user.vip_tier);
        const requiredTierIndex = tierOrder.indexOf(rules.minTier);
        return userTierIndex >= requiredTierIndex;
        
      default:
        return false;
    }
  }
}

module.exports = SegmentService;
```

### 5. Campaign Automation Service
```javascript
// services/CampaignAutomationService.js
const db = require('../config/database');
const EmailQueueService = require('./EmailQueueService');

class CampaignAutomationService {
  constructor() {
    this.emailQueue = new EmailQueueService();
  }

  async handleSegmentChanges(userId, newSegments) {
    const previousSegments = await this.getUserSegments(userId);
    const enteredSegments = newSegments.filter(s => !previousSegments.includes(s));
    
    for (const segmentId of enteredSegments) {
      await this.triggerSegmentCampaigns(userId, segmentId);
    }
    
    await this.updateUserSegments(userId, newSegments);
  }

  async getUserSegments(userId) {
    const result = await db.query(`
      SELECT segment_id FROM user_segments WHERE user_id = $1
    `, [userId]);
    return result.rows.map(row => row.segment_id);
  }

  async updateUserSegments(userId, segmentIds) {
    // Remove old segments
    await db.query(`
      DELETE FROM user_segments WHERE user_id = $1
    `, [userId]);
    
    // Add new segments
    for (const segmentId of segmentIds) {
      await db.query(`
        INSERT INTO user_segments (user_id, segment_id)
        VALUES ($1, $2)
      `, [userId, segmentId]);
    }
  }

  async triggerSegmentCampaigns(userId, segmentId) {
    const campaigns = await this.getActiveCampaignsForSegment(segmentId);
    
    for (const campaign of campaigns) {
      if (await this.shouldTriggerCampaign(userId, campaign)) {
        await this.emailQueue.queueCampaignEmail(userId, campaign);
      }
    }
  }

  async getActiveCampaignsForSegment(segmentId) {
    const result = await db.query(`
      SELECT * FROM campaigns 
      WHERE segment_id = $1 AND is_active = true
    `, [segmentId]);
    return result.rows;
  }

  async shouldTriggerCampaign(userId, campaign) {
    // Check if already sent
    const alreadySent = await db.query(`
      SELECT id FROM campaign_logs 
      WHERE user_id = $1 AND campaign_id = $2
    `, [userId, campaign.id]);
    
    if (alreadySent.rows.length > 0) return false;
    
    // Check user preferences
    const user = await db.query(`
      SELECT email_opt_in FROM users WHERE id = $1
    `, [userId]);
    
    return user.rows[0]?.email_opt_in || false;
  }
}

module.exports = CampaignAutomationService;
```

### 6. Email Queue Service
```javascript
// services/EmailQueueService.js
const { Queue } = require('bullmq');
const redis = require('../config/redis');
const db = require('../config/database');

class EmailQueueService {
  constructor() {
    this.emailQueue = new Queue('email-campaigns', {
      connection: redis,
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
    const template = await this.getEmailTemplate(campaign.template_id);
    
    const jobData = {
      userId,
      campaignId: campaign.id,
      segmentId: campaign.segment_id,
      template: template,
      userData: user,
      sendAt: new Date()
    };
    
    const jobOptions = {
      jobId: `${userId}_${campaign.id}_${Date.now()}`,
      delay: campaign.send_delay || 0
    };
    
    await this.emailQueue.add('send-campaign-email', jobData, jobOptions);
    
    // Log campaign trigger
    await this.logCampaignTrigger(userId, campaign.id, campaign.segment_id);
  }

  async getUserProfile(userId) {
    const result = await db.query(`
      SELECT * FROM users WHERE id = $1
    `, [userId]);
    return result.rows[0];
  }

  async getEmailTemplate(templateId) {
    const result = await db.query(`
      SELECT * FROM email_templates WHERE id = $1
    `, [templateId]);
    return result.rows[0];
  }

  async logCampaignTrigger(userId, campaignId, segmentId) {
    await db.query(`
      INSERT INTO campaign_logs (user_id, campaign_id, segment_id, status)
      VALUES ($1, $2, $3, 'queued')
    `, [userId, campaignId, segmentId]);
  }
}

module.exports = EmailQueueService;
```

### 7. Email Worker
```javascript
// workers/EmailWorker.js
const { Worker } = require('bullmq');
const redis = require('../config/redis');
const db = require('../config/database');
const sgMail = require('@sendgrid/mail');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailWorker {
  constructor() {
    this.worker = new Worker('email-campaigns', async (job) => {
      await this.processEmailJob(job);
    }, {
      connection: redis,
      concurrency: 10
    });
    
    this.setupWorkerEvents();
  }

  setupWorkerEvents() {
    this.worker.on('completed', (job) => {
      console.log(`Email job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Email job ${job.id} failed:`, err);
    });
  }

  async processEmailJob(job) {
    const { userId, campaignId, template, userData } = job.data;
    
    try {
      const emailContent = this.renderTemplate(template, userData);
      
      const result = await sgMail.send({
        to: userData.email,
        from: template.from_email,
        subject: emailContent.subject,
        html: emailContent.html,
        customArgs: {
          campaignId: campaignId.toString(),
          userId: userId.toString(),
          segmentId: job.data.segmentId.toString()
        }
      });
      
      await this.logEmailSent(userId, campaignId, result[0].headers['x-message-id']);
      
    } catch (error) {
      await this.logEmailFailed(userId, campaignId);
      throw error;
    }
  }

  renderTemplate(template, userData) {
    let html = template.html;
    let subject = template.subject;
    
    const replacements = {
      '{{first_name}}': userData.first_name || 'Player',
      '{{total_deposits}}': userData.total_deposits || 0,
      '{{vip_tier}}': userData.vip_tier || 'Bronze',
      '{{last_login_date}}': userData.last_login_date ? new Date(userData.last_login_date).toLocaleDateString() : 'Never'
    };
    
    for (const [placeholder, value] of Object.entries(replacements)) {
      html = html.replace(new RegExp(placeholder, 'g'), value);
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return { html, subject };
  }

  async logEmailSent(userId, campaignId, messageId) {
    await db.query(`
      UPDATE campaign_logs 
      SET status = 'sent', email_message_id = $1
      WHERE user_id = $2 AND campaign_id = $3
    `, [messageId, userId, campaignId]);
  }

  async logEmailFailed(userId, campaignId) {
    await db.query(`
      UPDATE campaign_logs 
      SET status = 'failed'
      WHERE user_id = $1 AND campaign_id = $2
    `, [userId, campaignId]);
  }
}

module.exports = EmailWorker;
```

## Step 4: API Endpoints

```javascript
// routes/events.js
const express = require('express');
const router = express.Router();
const EventProcessor = require('../services/EventProcessor');

const eventProcessor = new EventProcessor();

router.post('/events', async (req, res) => {
  try {
    const event = req.body;
    
    // Validate event
    if (!event.type || !event.userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await eventProcessor.processEvent(event);
    res.json({ success: true });
  } catch (error) {
    console.error('Event processing failed:', error);
    res.status(500).json({ error: 'Event processing failed' });
  }
});

module.exports = router;
```

## Step 5: Sample Data Setup

```javascript
// scripts/setup-sample-data.js
const db = require('../config/database');

async function setupSampleData() {
  // Create sample segments
  await db.query(`
    INSERT INTO segments (name, description, rules) VALUES
    ('High Rollers', 'Players with deposits over $1000', '{"type": "deposit_threshold", "threshold": 1000, "daysWindow": 30}'),
    ('Active Players', 'Players who login frequently', '{"type": "login_frequency", "minLogins": 5, "daysWindow": 7}'),
    ('VIP Members', 'Gold tier and above', '{"type": "vip_tier", "minTier": "Gold"}')
  `);

  // Create sample email templates
  await db.query(`
    INSERT INTO email_templates (name, subject, html, from_email) VALUES
    ('High Roller Welcome', 'Welcome to the High Roller Club, {{first_name}}!', 
     '<h1>Congratulations {{first_name}}!</h1><p>You''ve joined our exclusive High Roller Club with total deposits of ${{total_deposits}}.</p>', 
     'noreply@yourgame.com'),
    ('VIP Upgrade', 'Congratulations on your VIP upgrade, {{first_name}}!', 
     '<h1>Welcome to {{vip_tier}} tier!</h1><p>You''ve been upgraded to {{vip_tier}} status.</p>', 
     'noreply@yourgame.com')
  `);

  // Create sample campaigns
  await db.query(`
    INSERT INTO campaigns (name, segment_id, template_id, send_delay) VALUES
    ('Welcome High Roller', 1, 1, 0),
    ('VIP Upgrade Congratulations', 3, 2, 0)
  `);
}

setupSampleData().then(() => {
  console.log('Sample data created successfully');
  process.exit(0);
}).catch(console.error);
```

## Step 6: Start the System

```javascript
// app.js
const express = require('express');
const EventProcessor = require('./services/EventProcessor');
const EmailWorker = require('./workers/EmailWorker');
const eventRoutes = require('./routes/events');

const app = express();
app.use(express.json());

// Initialize services
const eventProcessor = new EventProcessor();
const emailWorker = new EmailWorker();

// Routes
app.use('/api', eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CRM system running on port ${PORT}`);
});
```

## Step 7: Test the System

```javascript
// Test script
const axios = require('axios');

async function testAutomation() {
  // Test deposit event
  await axios.post('http://localhost:3000/api/events', {
    type: 'deposit',
    userId: 123,
    amount: 1500,
    timestamp: new Date().toISOString()
  });
  
  console.log('Deposit event sent');
}

testAutomation();
```

## Environment Variables

Create a `.env` file:
```env
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_database
DB_PASSWORD=your_password
DB_PORT=5432

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

SENDGRID_API_KEY=your_sendgrid_api_key
```

This setup provides a complete automated CRM system that will:
1. Process events in real-time
2. Update user profiles automatically
3. Evaluate segments based on user behavior
4. Trigger campaigns when users enter segments
5. Send personalized emails via SendGrid
6. Track all activities for analytics

The system is scalable and can handle your 500K users and 200K daily emails with proper infrastructure scaling.