import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'

export class GetEmailTemplateHandler extends BaseHandler {
  async run () {
    const { emailTemplateId } = this.args

    const emailTemplate = await db.EmailTemplate.findOne({
      where: { emailTemplateId }
    })
    if (!emailTemplate) throw new AppError(Errors.EMAIL_TEMPLATE_NOT_FOUND)

    return { emailTemplate }
  }
}
