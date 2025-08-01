export const getAllSegmentSchema = {
  query: {
    type: 'object',
    properties: {
      name: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      limit: { type: 'string' },
      pageNo: { type: 'string' },
      isActive: { type: ['string', 'null'] }
    }
  }
}
