import { DAYS_OF_WEEK } from '@src/utils/constants/crm.constants'

export const CreateCampaignSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      templateId: { type: 'string' },
      segmentIds: {
        type: 'array',
        items: { type: 'integer' },
        minItems: 1
      },
      status: { type: 'string' },
      isActive: { type: 'boolean' },
      daysOfWeek: {
        type: 'array',
        items: {
          type: 'string',
          enum: Object.values(DAYS_OF_WEEK)
        },
        nullable: true
      },
      time: {
        type: 'string',
        pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', // Valid HH:mm format (24-hour)
        nullable: true
      },
      popupId: { type: 'integer' }
    },
    required: ['name', 'templateId', 'segmentIds']
  }
}
