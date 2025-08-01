// @src/queues/crm.queue.ts

import queueWorkerRedisClient from '@src/libs/queueWorkerRedisClient'
import Bull from 'bull'
import Redis from 'ioredis'

const opts = {
  createClient: function (type, opts) {
    switch (type) {
      case 'client':
        return queueWorkerRedisClient.client
      case 'subscriber':
        return queueWorkerRedisClient.publisherClient
      default:
        return new Redis(queueWorkerRedisClient.connectionOptions)
    }
  },
  redis: queueWorkerRedisClient.connectionOptions,

  limiter: {
    max: 1,           // Allow 1 job
    duration: 60000   // Per 60,000ms (1 minute)
  },

  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 3000 },
    removeOnComplete: 100,  // Keep last 100 completed jobs
    removeOnFail: 50        // Keep last 50 failed jobs
  }

}

// 🎯 Dedicated CRM Queue
export const crmQueue = new Bull('CRM-Activity-Queue', opts)

// 🧩 CRM-related Jobs
export const JOB_SEND_PROMO_EMAIL = 'SendPromoEmailJob'
export const JOB_USER_SEGMENT_UPDATE = 'UserSegmentUpdateJob'
export const JOB_EMAIL_BATCHES = 'SendEmailBatchesJob'
