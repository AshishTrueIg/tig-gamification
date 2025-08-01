import { SEGMENT_FIELDS, SEGMENT_LOGIC, SEGMENT_OPERATORS } from '@src/utils/constants/crm.constants'

export const createSegmentSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      rules: {
        type: 'object',
        properties: {
          conditions: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  enum: Object.values(SEGMENT_FIELDS)
                },
                operator: {
                  type: 'string',
                  enum: Object.values(SEGMENT_OPERATORS)
                },
                value: { type: ['string', 'integer', 'boolean'] }
              },
              required: ['field', 'operator']
            }
          },
          logic: {
            type: 'string',
            enum: Object.values(SEGMENT_LOGIC)
          }
        },
        required: ['conditions']
      },
      isActive: {
        type: 'string',
        enum: ['true', 'false']
      }
    },
    required: ['name', 'description', 'rules']
  }
}
