import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'

export class GetTicketMessagesHandler extends BaseHandler {
  async run () {
    const { ticketId } = this.args
    const mainTicket = await db.Ticket.findOne({
      where: { id: ticketId },
      include: [
        {
          model: db.TicketMessage,
          as: 'ticketMessage'
        },
        {
          model: db.User,
          attributes: ['username', 'userId', 'email']
        }
      ]
    })

    return { mainTicket }
  }
}
