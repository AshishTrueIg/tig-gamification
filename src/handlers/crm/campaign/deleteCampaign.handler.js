import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/baseHandler'

export class DeleteCampaignHandler extends BaseHandler {
  async run () {
    const { campaignId } = this.args
    const transaction = this.context.sequelizeTransaction

    const campaign = await db.Campaign.findByPk(campaignId, { transaction })

    if (!campaign) {
      throw new AppError(Errors.CAMPAIGN_NOT_FOUND)
    }

    await campaign.destroy({ transaction })

    return {
      message: 'Campaign deleted successfully'
    }
  }
}
