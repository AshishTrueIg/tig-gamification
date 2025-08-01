import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'
import { EMAIL_TEMPLATE_PRIMARY_STATUS } from '@src/utils/constant'

export class MarkEmailPrimaryHandler extends BaseHandler {
  async run () {
    const { emailTemplateId, type } = this.args

    const checkTemplateExists = await db.EmailTemplate.findOne({
      where: { emailTemplateId, type }
    })
    if (!checkTemplateExists) throw new AppError(Errors.EMAIL_TEMPLATE_NOT_FOUND)

    if (checkTemplateExists.isPrimary) {
      throw new AppError(Errors.PRIMARY_TEMPLATE)
    }

    await db.EmailTemplate.update(
      { isPrimary: EMAIL_TEMPLATE_PRIMARY_STATUS.DISABLE },
      { where: { type } }
    )
    const emailTemplate = await checkTemplateExists.set({ isPrimary: EMAIL_TEMPLATE_PRIMARY_STATUS.PRIMARY }).save()

    return { emailTemplate }
  }
}
