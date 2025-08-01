export const getAllCampaignSchema = {
  query: {
    type: 'object',
    properties: {
      name: { type: ['string', 'null'] },
      limit: { type: 'string' },
      pageNo: { type: 'string' },
      isActive: { type: ['string', 'null'] }
    }
  }
}
