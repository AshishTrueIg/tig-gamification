import Bull from 'bull'
import Redis from 'ioredis'
import queueWorkerRedisClient from '../libs/queueWorkerRedisClient'

const opts = {
  createClient: function (type, opts) {
    switch (type) {
      case 'client':
        return queueWorkerRedisClient.client
      case 'subscriber':
        return queueWorkerRedisClient.publisherClient
      default:
        return new Redis(opts)
    }
  },
  redis: queueWorkerRedisClient.connection,
  defaultJobOptions: {
    attempts: 10,
    backoff: 60000,
    removeOnComplete: 10000
  }
}

export const demoQueue = new Bull('Demo-Queue', {
  ...opts
})

export const JOB_DEMO_HELLO_WORLD = 'DemoHelloWorld'
