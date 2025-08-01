import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/baseHandler'

export class CreateSegmentHandler extends BaseHandler {
  async run () {
    const { name, description, rules } = this.args
    const transaction = this.context.sequelizeTransaction

    const existing = await db.Segment.findOne({
      where: { name }
    }, { transaction })

    if (existing) {
      throw new AppError(Errors.SEGMENTS_ALREADY_EXISTS)
    }

    const segment = await db.Segment.create({
      name,
      description,
      rules
    }, { transaction })

    return { segment }
  }
}
