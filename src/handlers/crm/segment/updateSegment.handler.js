import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'

export class UpdateSegmentHandler extends BaseHandler {
  async run () {
    const { segmentId, name, description, rules, isActive } = this.args
    const query = { name, description, rules, isActive }
    const transaction = this.context.sequelizeTransaction

    const checkSegmentExists = await db.Segment.findOne({
      where: { id: segmentId },
      transaction
    })

    if (!checkSegmentExists) throw new AppError(Errors.SEGMENTS_NOT_FOUND)

    const updatedSegment = await db.Segment.update(query, {
      where: { id: segmentId },
      transaction
    })

    return { success: true }
  }
}
