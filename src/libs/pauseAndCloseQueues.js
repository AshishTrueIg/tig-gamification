import { demoQueue } from '../queues/demo.queue'
import Logger from './logger'

export default async function () {
  await demoQueue.pause(true)
  await demoQueue.close()

  Logger.info('Pause and Close Queues', { message: 'Paused all queues, exiting gracefully' })
}
