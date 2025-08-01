'use strict'

import { EMAIL_EVENT_TYPES } from '@src/utils/constants/sendgrid.constants'

module.exports = {
  async up (queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('email_events', {
        email_event_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        event_type: {
          type: DataTypes.ENUM(...Object.values(EMAIL_EVENT_TYPES)),
          allowNull: false,
          defaultValue: EMAIL_EVENT_TYPES.DELIVERED
        },
        sg_message_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'user_id'
          }
        },
        campaign_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'campaigns',
            key: 'id'
          }
        },
        response: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE
        }
      }, { schema: 'public', transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down (queryInterface) {
    await queryInterface.dropTable('email_events', { schema: 'public', transaction })
  }
}
