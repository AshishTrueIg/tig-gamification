export const UpdateCampaignSchema = {
  body: {
    type: 'object',
    properties: {
      campaignId: { type: 'integer' },
      name: { type: 'string' },
      templateId: { type: 'string' },
      isActive: { type: 'boolean' },
      segmentIds: {
        type: 'array',
        items: { type: 'integer' }
      },
      daysOfWeek: {
        type: 'array',
        items: { type: 'string' }
      },
      time: {
        type: 'string'
      }
    },
    required: ['campaignId']
  }
}
