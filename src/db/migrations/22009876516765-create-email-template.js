'use strict'

import { TEMPLATE_TYPES } from '@src/utils/constants/sendgrid.constants'

module.exports = {
  async up (queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('email_templates', {
        email_template_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        label: {
          type: DataTypes.STRING,
          allowNull: false
        },
        template_provider_id: {
          type: DataTypes.STRING,
          allowNull: false
        },
        type: {
          type: DataTypes.ENUM(...Object.values(TEMPLATE_TYPES)),
          allowNull: false,
          defaultValue: TEMPLATE_TYPES.GENERAL
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE
        }
      }, {
        schema: 'public',
        transaction
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('email_templates', { schema: 'public' })
  }
}
