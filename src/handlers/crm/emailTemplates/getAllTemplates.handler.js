import db from '@src/db/models'
import { AppError } from '@src/errors/app.error'
import { Errors } from '@src/errors/errorCodes'
import { BaseHandler } from '@src/libs/baseHandler'

export class GetAllEmailTemplateHandler extends BaseHandler {
  async run () {
    const emailTemplates = await db.EmailTemplate.findAll()
    if (!emailTemplates) throw new AppError(Errors.EMAIL_TEMPLATE_NOT_FOUND)

    return { templateCount: emailTemplates.length, emailTemplates }
  }
}
