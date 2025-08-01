import { demoQueue } from '../queues/demo.queue'
import Logger from './logger'

export default async function () {
  await demoQueue.close()

  Logger.info('Close Queues', { message: 'Closed all queues, exiting gracefully' })
}
