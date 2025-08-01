import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/baseHandler'
import { TICKET_STATUSES } from '@src/utils/constants/public.constants'

export class SendTicketMessageHandler extends BaseHandler {
  async run () {
    const { ticketId, user, message } = this.args
    const transaction = this.dbTransaction

    const ticket = await db.Ticket.findOne({
      where: { id: ticketId }
    })

    if (!ticket || ticket.status == TICKET_STATUSES.CLOSED) { throw new AppError(Errors.INVALID_TICKET_ID) }

    const ticketMessage = await db.TicketMessage.create(
      {
        ticketId,
        message,
        senderId: user.userId,
        isAdminResponse: true
      },
      transaction
    )

    return { ticketMessage }
  }
}
