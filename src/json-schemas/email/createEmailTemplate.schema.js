export const createEmailTemplateSchema = {
  body: {
    type: 'object',
    properties: {
      label: { type: 'string' },
      language: { type: 'string' },
      dynamicData: { type: 'array' },
      templateCode: { type: 'string' },
      type: {
        type: 'number',
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
      }
    },
    required: ['label', 'type', 'templateCode', 'language', 'dynamicData']
  }
}
