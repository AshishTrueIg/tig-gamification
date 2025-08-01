export const deleteSegmentSchema = {
  body: {
    type: 'object',
    properties: {
      segmentId: { type: 'integer', minimum: 1 }
    },

    required: ['segmentId']
  }
}
