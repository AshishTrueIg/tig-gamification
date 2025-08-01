import db from "@src/db/models"
import { AppError } from "@src/errors/app.error"
import { Errors } from "@src/errors/errorCodes"
import { getUserBySegmentId } from "@src/helpers/getCrmUsers.helper"
import { Logger } from "@src/libs/logger"
import { BaseHandler } from "@src/libs/logicBase"
import { crmQueue, JOB_EMAIL_BATCHES } from "@src/queues/crm.queue"

const BATCH_SIZE = 25000

export class PrepareEmailChucksService extends BaseHandler {
    async run() {
        try {
            const { emailTemplateId, segmentId, campaignId } = this.args
            const siteSetting = await db.GlobalSetting.findOne({
                where: { key: 'SITE_INFORMATION' },
                raw: true
            })
            if (!emailTemplateId) {
                throw new AppError(Errors.EMPTY_MESSAGE, "Email Template ID is required");
            }

            // Fetch and validate email template
            const emailTemplate = await db.EmailTemplate.findOne({
                where: { templateProviderId: emailTemplateId },
            });

            if (!emailTemplate) {
                throw new AppError(Errors.EMAIL_TEMPLATE_NOT_FOUND);
            }

            // Get users by segment
            const { users: updatedUsers } = await getUserBySegmentId(segmentId);

            if (!updatedUsers || updatedUsers.length === 0) {
                throw new AppError(Errors.EMPTY_MESSAGE, "No users found for this segment");
            }

            // Break into batches ensuring last batch has at least 1000 users
            const emailBatches = [];
            const MIN_LAST_BATCH_SIZE = 1000;
            
            for (let i = 0; i < updatedUsers.length; i += BATCH_SIZE) {
                const remainingUsers = updatedUsers.length - i;
                const currentBatchSize = Math.min(BATCH_SIZE, remainingUsers);
                
                // Check if this would be the last batch and it's smaller than minimum
                if (remainingUsers <= BATCH_SIZE && currentBatchSize < MIN_LAST_BATCH_SIZE && emailBatches.length > 0) {
                    // Merge with the previous batch
                    const lastBatch = emailBatches[emailBatches.length - 1];
                    lastBatch.users = lastBatch.users.concat(updatedUsers.slice(i));
                    Logger.info(`Merged last batch of ${currentBatchSize} users with previous batch. Final batch size: ${lastBatch.users.length}`);
                } else {
                    // Create new batch
                    emailBatches.push({
                        users: updatedUsers.slice(i, i + BATCH_SIZE),
                        templateProviderId: emailTemplateId,
                        batchNumber: emailBatches.length + 1,
                        campaignId,
                        siteSetting
                    });
                }
            }

            // Enqueue all batches
            for (const batch of emailBatches) {
                await crmQueue.add(JOB_EMAIL_BATCHES, batch, {
                    attempts: 3
                });
            }

            return { success: true, message: `${emailBatches.length} batches enqueued` };
        } catch (error) {
            Logger.info(`Prepare chuks failed with error ---- ${error}`, error);
            throw error;
        }
    }
}
