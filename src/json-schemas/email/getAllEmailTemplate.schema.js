export const getAllEmailTemplateSchema = {
  query: {
    type: 'object',
    properties: {
      label: { type: ['string', 'null'] },
      limit: { type: 'string' },
      pageNo: { type: 'string' }
    }
  }
}
