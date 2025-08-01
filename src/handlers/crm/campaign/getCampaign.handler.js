import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/baseHandler'

export class GetCampaignHandler extends BaseHandler {
  async run () {
    const { campaignId } = this.args

    const campaign = await db.Campaign.findByPk(campaignId, {
      include: [
        {
          model: db.Segment,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    })

    if (!campaign) {
      throw new AppError(Errors.CAMPAIGN_NOT_FOUND)
    }

    return { campaign }
  }
}
