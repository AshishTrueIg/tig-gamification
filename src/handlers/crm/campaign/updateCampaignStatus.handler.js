import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
// import { JobBackendAxios } from "@src/libs/axios/jobBackend.axios";
import { BaseHandler } from '@src/libs/baseHandler'
import { AddSendPromoEmailJobHandler } from '@src/services/email/addSendPromoEmailJob.handler'

export class UpdateCampaignStatusHandler extends BaseHandler {
  async run () {
    const { campaignId, status } = this.args
    const transaction = this.context.sequelizeTransaction
    const campaign = await db.Campaign.findByPk(campaignId, { transaction })
    if (!campaign) {
      throw new AppError(Errors.CAMPAIGN_NOT_FOUND)
    }

    const segment = await db.CampaignSegment.findOne({
      where: {
        campaignId
      },
      attributes: ['segmentId']
    }, { transaction })

    if (!['running', 'stopped', 'draft', 'completed'].includes(status)) {
      throw new AppError(Errors.INVALID_CAMPAIGN_STATUS)
    }

    if (campaign.isActive) {
      if (campaign.status === status && status === 'running') {
        console.log('Campaign already running — skipping job trigger')
        return { campaign }
      }

      campaign.status = status
      await campaign.save({ transaction })

      // Call Email Job API only if campaign is being started

      const jobPayload = {
        emailTemplateId: campaign.templateId,
        segmentId: segment.segmentId,
        daysOfWeek: campaign.daysOfWeek,
        time: campaign.time,
        status: status,
        campaignId: campaignId
      }

      const data = await AddSendPromoEmailJobHandler.execute(jobPayload);

    } else {
      throw new AppError(Errors.CAMPAIGN_NOT_ACTIVE)
    }

    return { campaign }
  }
}
