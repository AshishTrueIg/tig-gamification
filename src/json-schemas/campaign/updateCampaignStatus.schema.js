export const updateCampaignStatusSchema = {
  body: {
    type: 'object',
    properties: {
      campaignId: { type: 'integer' },
      status: { type: 'string' }
    },
    required: ['campaignId', 'status']
  }
}
