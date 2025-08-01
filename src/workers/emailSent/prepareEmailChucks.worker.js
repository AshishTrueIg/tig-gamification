import WorkerBase from '@src/libs/workerBase';
import { Logger } from '@src/libs/logger';
import { PrepareEmailChucksService } from '@src/services/email/prepareEmailsChucks.service';

class SendEmailBatchesJob extends WorkerBase {
  async run() {
    try {
      const result = await PrepareEmailChucksService.execute(this.args.job.data);
    } catch (error) {
      Logger.error(error, '[CRM:SendEmailBatchesJob] Error:');
      throw error;
    }
  }
}

// Bull-compatible job processor
export default async (job) => {
  return await SendEmailBatchesJob.run({ job });
};
