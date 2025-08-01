export const deleteEmailTemplateSchema = {
  body: {
    type: 'object',
    properties: {
      emailTemplateId: { type: 'number' }
    },
    required: ['emailTemplateId']
  }
}
