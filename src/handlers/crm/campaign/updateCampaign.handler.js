import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/baseHandler'

export class UpdateCampaignHandler extends BaseHandler {
  async run () {
    const { campaignId, name, templateId, isActive, segmentIds, daysOfWeek, time } = this.args
    const transaction = this.context.sequelizeTransaction

    const campaign = await db.Campaign.findByPk(campaignId, { transaction })
    if (!campaign) {
      throw new AppError(Errors.CAMPAIGN_NOT_FOUND)
    }

    if (Array.isArray(segmentIds) && segmentIds.length > 0) {
      const validSegments = await db.Segment.findAll({
        where: { id: segmentIds },
        transaction
      })

      if (validSegments.length !== segmentIds.length) {
        throw new AppError(Errors.INVALID_SEGMENT_ID)
      }

      await campaign.setSegments(segmentIds, { transaction })
    }

    if (name !== undefined) campaign.name = name
    if (templateId !== undefined) campaign.templateId = templateId
    if (isActive !== undefined) campaign.isActive = isActive
    if (daysOfWeek !== undefined) campaign.daysOfWeek = daysOfWeek
    if (time !== undefined) campaign.time = time

    await campaign.save({ transaction })

    return { campaign }
  }
}
