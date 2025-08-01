export const getCampaignSchema = {
  query: {
    type: 'object',
    properties: {
      campaignId: { type: 'string' }
    },
    required: ['campaignId']
  }
}
