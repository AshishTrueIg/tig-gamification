import Logger from '../libs/logger'
import AttachOneTimeListeners from './attachOneTimeListener'

(async () => {
  try {
    await AttachOneTimeListeners.run({})
  } catch (error) {
    Logger.error('Listener fail', { message: error })
    process.exit(1)
  }
})()
