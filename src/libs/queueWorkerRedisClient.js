import Redis from 'ioredis'
import config from '../configs/app.config'

const connection = {
  host: config.get('redis.host'),
  port: config.get('redis.port'),
  password: config.get('redis.password'),
  maxRetriesPerRequest: null,
  enableReadyCheck: false
}

export default {
  connection,
  publisherClient: new Redis(connection),
  subscriberClient: new Redis(connection),
  client: new Redis(connection)
}
