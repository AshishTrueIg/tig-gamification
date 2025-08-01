import WorkerBase from '@src/libs/workerBase'
import { EmailSentService } from '@src/services/email/emailSent.service'

class EmailSentWorker extends WorkerBase {
  async run() {
    try {
      const result = await EmailSentService.execute(this.args.job.data)
      return result
    } catch (error) {
      throw error
    }
  }
}

export default async (job) => {
  // Run the worker job
  const result = await EmailSentWorker.run({ job })
  return result
}
