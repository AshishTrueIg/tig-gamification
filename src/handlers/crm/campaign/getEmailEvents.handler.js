import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'
import { ApiHelper } from '@src/utils/api.utils'

export class GetEmailEventsHandler extends BaseHandler {
  async run () {
    const { campaignId } = this.args

    const { offset, limit, pageNo } = ApiHelper.getPagination(
      this.args.pageNo,
      this.args.limit
    )

    const emailEvents = await db.EmailEvent.findAndCountAll({
      where: { campaignId: campaignId },
      order: [['emailEventId', 'ASC']],
      limit: limit,
      offset
    })

    return {
      pageNo,
      totalPages: Math.ceil(emailEvents.count / limit),
      emailEvents: emailEvents.rows
    }
  }
}
