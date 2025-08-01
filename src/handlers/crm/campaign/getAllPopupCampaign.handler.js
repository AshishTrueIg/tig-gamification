import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'
import { ApiHelper } from '@src/utils/api.utils'
import { Op } from 'sequelize'

export class GetAllPopupCampaignsHandler extends BaseHandler {
  async run () {
    const { name, isActive } = this.args
    const { offset, limit, pageNo } = ApiHelper.getPagination(
      this.args.pageNo,
      this.args.limit
    )

    const query = {
      popupId: { [Op.ne]: null },
      ...(isActive !== undefined && { isActive }),
      ...(name && { name: { [Op.iLike]: `%${name}%` } })
    }

    const campaigns = await db.Campaign.findAndCountAll({
      where: query,
      limit: limit,
      order: [['id', 'DESC']],
      offset,
      include: [
        {
          model: db.Segment,
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    })

    return {
      pageNo,
      totalPages: Math.ceil(campaigns.count / limit),
      campaigns: campaigns.rows
    }
  }
}
