export const updateEmailTemplateSchema = {
  body: {
    type: 'object',
    properties: {
      label: { type: 'string' },
      templateCode: { type: 'object' },
      emailTemplateId: { type: 'string' },
      dynamicData: { type: ['array', 'null'] }
    },
    required: ['id', 'label', 'emailTemplateId', 'templateCode']
  }
}
