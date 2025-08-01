import { BaseHandler } from '@src/libs/baseHandler';
import { crmQueue } from '@src/queues/crm.queue';
import { Logger } from '@src/libs/logger';

export class RemoveSendPromoEmailJobHandler extends BaseHandler {
  async run() {
    const { emailTemplateId, daysOfWeek } = this.args;

    if (!emailTemplateId || !Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
      throw new Error('Missing or invalid emailTemplateId or daysOfWeek');
    }

    for (const day of daysOfWeek) {
      const jobId = `promo-${emailTemplateId}-${day}`;
      const job = await crmQueue.getJob(jobId);

      if (job) {
        await job.remove();
        Logger.info(`Removed job: ${jobId}`);
      } else {
        Logger.info(`No job found for: ${jobId}`);
      }
    }

    return { success: true };
  }
}
