export const markEmailPrimarySchema = {
  body: {
    type: 'object',
    properties: {
      emailTemplateId: { type: 'number' },
      type: {
        type: 'number',
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
      }
    },
    required: ['id', 'emailTemplateId', 'type']
  }
}
