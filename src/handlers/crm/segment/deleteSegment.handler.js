import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/baseHandler'

export class DeleteSegmentHandler extends BaseHandler {
  async run () {
    const transaction = this.context.sequelizeTransaction

    const segment = await db.Segment.findOne({ where: { id: this.args.segmentId }, transaction })

    if (!segment) {
      throw new AppError(Errors.SEGMENTS_NOT_FOUND)
    }

    try {
      await segment.destroy({ transaction })
      return { success: true }
    } catch (error) {
      throw error
    }
  }
}
