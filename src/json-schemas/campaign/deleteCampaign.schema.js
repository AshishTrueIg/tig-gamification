export const deleteCampaignSchema = {
  body: {
    type: 'object',
    properties: {
      campaignId: { type: 'integer' }
    },
    required: ['campaignId']
  }
}
