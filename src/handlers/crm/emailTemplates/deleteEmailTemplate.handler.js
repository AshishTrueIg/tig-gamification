import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'
import { EMAIL_TEMPLATE_PRIMARY_STATUS } from '@src/utils/constant'

export class DeleteEmailTemplateHandler extends BaseHandler {
  async run () {
    const { emailTemplateId } = this.args
    const transaction = this.context.sequelizeTransaction

    const emailTemplate = await db.EmailTemplate.findOne({
      where: { emailTemplateId },
      transaction
    })

    if (!emailTemplate) throw new AppError(Errors.EMAIL_TEMPLATE_NOT_FOUND)

    if (emailTemplate.isPrimary) {
      throw new AppError(Errors.PRIMARY_EMAIL)
    }

    await emailTemplate.destroy({ transaction })
    return { success: true }
  }
}
