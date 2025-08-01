import db from '@src/db/models'
import { ApiHelper } from '@src/utils/api.utils'
import { BaseHandler } from '@src/libs/baseHandler'
import { Op, where, cast, col } from 'sequelize'

export class GetTicketsHandler extends BaseHandler {
  async run () {
    const { status, ticketId, username, search } = this.args
    const { offset, limit, pageNo } = ApiHelper.getPagination(
      this.args.pageNo,
      this.args.limit
    )

    let query = {}
    if (status) query = { status }
    if (ticketId) query.id = ticketId
    if (username) {
      query = {
        ...query,
        '$User.username$': { [Op.like]: `%${username}%` }
      }
    }
    if (search) {
      query = {
        ...query,
        [Op.or]: [
          where(cast(col('status'), 'TEXT'), {
            [Op.iLike]: `%${search}%`
          })
        ]
      }
    }
    const tickets = await db.Ticket.findAll({
      where: query,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: db.User,
          as: 'User',
          attributes: ['username', 'userId', 'email']
        }
      ]
    })

    return { tickets, pageNo, totalPages: Math.ceil(tickets.count / limit) }
  }
}
