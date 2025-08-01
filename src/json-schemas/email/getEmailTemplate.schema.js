export const getEmailTemplateSchema = {
  query: {
    type: 'object',
    properties: {
      emailTemplateId: { type: 'string' }
    },
    required: ['emailTemplateId']
  }
}
