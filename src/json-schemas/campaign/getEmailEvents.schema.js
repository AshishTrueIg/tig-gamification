export const getEmailEventSchema = {
  query: {
    type: 'object',
    properties: {
      campaignId: { type: ['string', 'integer'] },
      limit: { type: 'string' },
      pageNo: { type: 'string' }
    },
    required: ['campaignId']
  }
}
