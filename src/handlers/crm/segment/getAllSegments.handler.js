import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'
import { ApiHelper } from '@src/utils/api.utils'
import { Op } from 'sequelize'

export class GetAllSegmentsHandler extends BaseHandler {
  async run () {
    const { name, description, isActive, pageNo, limit } = this.args

    const query = {
      ...(isActive !== undefined && { isActive }),
      ...(name && { name: { [Op.iLike]: `%${name}%` } }),
      ...(description && { description: { [Op.iLike]: `%${description}%` } })
    }

    if (pageNo) {
      const { offset, limit: pageLimit, pageNo: currentPage } = ApiHelper.getPagination(pageNo, limit)
      const segments = await db.Segment.findAndCountAll({
        where: query,
        order: [['id', 'DESC']],
        limit: pageLimit,
        offset
      })

      return {
        pageNo: currentPage,
        totalPages: Math.ceil(segments.count / pageLimit),
        totalSegments: segments.count,
        segments: segments.rows
      }
    } else {
      const segments = await db.Segment.findAll({
        where: query,
        order: [['id', 'DESC']]
      })

      return {
        totalSegments: segments.length,
        segments: segments
      }
    }
  }
}
