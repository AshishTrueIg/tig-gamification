export const testEmailTemplateSchema = {
  body: {
    type: 'object',
    properties: {
      testEmail: { type: ['string', 'null'] },
      templateCode: { type: ['string', 'null'] },
      dynamicData: { type: 'object' }
    },
    required: ['templateCode', 'testEmail', 'dynamicData']
  }
}
