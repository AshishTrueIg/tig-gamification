import { Errors } from '@src/errors/errorCodes'
import { AppError } from '@src/errors/app.error'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'

export class UpdateEmailTemplateHandler extends BaseHandler {
  async run () {
    const { label, dynamicData, templateCode, emailTemplateId } = this.args
    const transaction = this.context.sequelizeTransaction
    let query

    query = { isDefault: true }

    const checkTemplateExists = await db.EmailTemplate.findOne({
      where: { ...query, emailTemplateId },
      transaction
    })

    if (!checkTemplateExists) throw new AppError(Errors.EMAIL_TEMPLATE_NOT_FOUND)

    const templateData = { label, dynamicData, templateCode: templateCode }
    const emailTemplate = await checkTemplateExists.set(templateData).save({ transaction })

    return { emailTemplate }
  }
}
