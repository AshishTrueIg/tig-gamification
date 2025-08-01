import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'

export class DeleteEmailTemplateLanguageHandler extends BaseHandler {
  async run () {
    const { emailTemplateId, language } = this.args
    const transaction = this.context.sequelizeTransaction
    let query

    query = { emailTemplateId }

    const emailTemplate = await db.EmailTemplate.findOne({
      where: query, transaction
    })

    if (!emailTemplate) throw new AppError(Errors.EMAIL_TEMPLATE_NOT_FOUND)

    if (language === 'EN') throw new AppError(Errors.PRIMARY_EMAIL)

    delete emailTemplate.templateCode[language]
    await emailTemplate.set({ templateCode: emailTemplate.templateCode }).save({ transaction })

    return { success: true }
  }
}
