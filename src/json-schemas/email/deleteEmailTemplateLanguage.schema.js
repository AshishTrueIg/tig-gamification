export const deleteEmailTemplateLanguageSchema = {
  body: {
    type: 'object',
    properties: {
      userType: { type: 'string' },
      language: { type: 'string' },
      emailTemplateId: { type: 'number' }
    },
    required: ['userType', 'emailTemplateId', 'language']
  }
}
