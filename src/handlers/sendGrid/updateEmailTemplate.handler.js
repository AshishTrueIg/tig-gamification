import config from '@src/configs/app.config'
import db from '@src/db/models'
import { BaseHandler } from '@src/libs/baseHandler'
import { dayjs } from '@src/libs/dayjs'
import axios from 'axios'
import { ApiHelper } from '@src/utils/api.utils'
import { TEMPLATE_TYPES } from '@src/utils/constants/sendgrid.constants'

export class UpdateSendGridEmailTemplateHandler extends BaseHandler {
  toSnakeCase (str) {
    return str
      .replace(/\s+/g, '_')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase()
      .replace(/__+/g, '_')
      .replace(/^_+|_+$/g, '')
  }

  async run () {
    const { offset, limit, pageNo } = ApiHelper.getPagination(this.args.pageNo, this.args.limit, this.args.pagination)

    const { data } = await axios.get('https://api.sendgrid.com/v3/templates', {
      headers: {
        Authorization: `Bearer ${config.get('sendGrid.apiKey')}`,
        'Content-Type': 'application/json'
      },
      params: {
        generations: 'dynamic'
      }
    })

    const templates = (data.templates || []).filter(
      t => t.name && t.id && !t.name.toLowerCase().startsWith('rich')
    )

    const existingTemplates = await db.EmailTemplate.findAll({
      attributes: ['emailTemplateId', 'label', 'templateProviderId', 'type'],
      where: { type: TEMPLATE_TYPES.GENERAL },
      raw: true
    })

    const labelToTemplateMap = new Map(
      existingTemplates.map(t => [t.label, t])
    )

    const timestamp = dayjs().toDate()
    const newTemplates = []
    const updates = []

    for (const template of templates) {
      const label = this.toSnakeCase(template.name)
      const existing = labelToTemplateMap.get(label)

      if (existing) {
        if (existing.templateProviderId !== template.id) {
          updates.push(
            db.EmailTemplate.update(
              {
                templateProviderId: template.id,
                updatedAt: timestamp,
                type: TEMPLATE_TYPES.GENERAL
              },
              { where: { emailTemplateId: existing.emailTemplateId } }
            )
          )
        }
      } else {
        newTemplates.push({
          label,
          templateProviderId: template.id,
          type: TEMPLATE_TYPES.GENERAL
        })
      }
    }

    if (newTemplates.length) {
      await db.EmailTemplate.bulkCreate(newTemplates)
    }

    if (updates.length) {
      await Promise.all(updates) // Run updates in parallel
    }

    const sendGridLabels = new Set(templates.map(t => this.toSnakeCase(t.name)))

    const obsoleteTemplates = existingTemplates.filter(
      t => !sendGridLabels.has(t.label) && t.type === TEMPLATE_TYPES.GENERAL
    )

    if (obsoleteTemplates.length > 0) {
      const obsoleteIds = obsoleteTemplates.map(t => t.emailTemplateId)

      await db.EmailTemplate.destroy({
        where: {
          emailTemplateId: obsoleteIds,
          type: TEMPLATE_TYPES.GENERAL
        }
      })
    }

    const condition = {
      attributes: ['emailTemplateId', 'label', 'templateProviderId'],
      where: { type: TEMPLATE_TYPES.GENERAL },
      order: [['emailTemplateId', 'ASC']]
    }

    if (this.args.limit) {
      condition.limit = limit,
      condition.offset = offset
    }

    const allTemplates = await db.EmailTemplate.findAndCountAll(condition)

    return { template: allTemplates.rows, pageNo, totalPages: this.args.limit ? Math.ceil(allTemplates.count / limit) : 1 }
  }
}
