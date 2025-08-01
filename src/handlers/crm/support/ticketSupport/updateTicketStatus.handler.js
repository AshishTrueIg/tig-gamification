import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/baseHandler'
import { TICKET_STATUSES } from '@src/utils/constants/public.constants'

export class UpdateTicketStatusHandler extends BaseHandler {
  async run () {
    const { ticketId, status } = this.args
    const transaction = this.dbTransaction

    // Check if the status is valid
    if (!Object.values(TICKET_STATUSES).includes(status)) { throw new AppError(Errors.INVALID_TICKET_STATUS) }

    const ticket = await db.Ticket.findOne({
      where: { id: ticketId },
      transaction
    })

    if (!ticket) { throw new AppError(Errors.INVALID_TICKET_ID) }

    const updatedTicet = await db.Ticket.update({ status }, { where: { id: ticketId }, transaction })

    return { updatedTicet }
  }
}
