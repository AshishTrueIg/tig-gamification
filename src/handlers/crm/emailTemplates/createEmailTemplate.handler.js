import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'
import { EMAIL_TEMPLATE_PRIMARY_STATUS } from '@src/utils/constant'

export class CreateEmailTemplateHandler extends BaseHandler {
  async run () {
    const { label, type, dynamicData, templateCode, language } = this.args
    const newTemplateCode = {}

    const transaction = this.context.sequelizeTransaction

    const checkTemplateExists = await db.EmailTemplate.findOne({
      where: { label, type },
      transaction
    })

    if (checkTemplateExists) throw new AppError(Errors.EMAIL_TEMPLATE_EXISTS)

    newTemplateCode[language] = templateCode
    const templateData = {
      type,
      label,
      dynamicData,
      templateCode: newTemplateCode,
      isPrimary: EMAIL_TEMPLATE_PRIMARY_STATUS.DISABLE
    }

    const emailTemplate = await db.EmailTemplateNewEntity.create({
      templateData,
      transaction
    })

    return { emailTemplate }
  }
}
