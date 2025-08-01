export const updateSegmentSchema = {
  body: {
    type: 'object',
    properties: {
      segmentId: { type: 'integer', minimum: 1 },
      name: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      rules: { type: 'object' },
      isActive: { type: ['string', 'null'] }
    },
    required: ['segmentId']
  }
}
