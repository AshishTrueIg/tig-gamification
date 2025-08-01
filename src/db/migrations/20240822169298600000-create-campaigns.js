'use strict'
import { CRM_CAMPAIGN_STATUS } from '@src/utils/constants/crm.constants'

module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('campaigns', {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      template_id: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'SendGrid email template ID'
      },
      status: {
        type: DataTypes.ENUM(Object.values(CRM_CAMPAIGN_STATUS)),
        defaultValue: CRM_CAMPAIGN_STATUS.DRAFT,
        allowNull: false
      },
      days_of_week: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: null
      },
      time: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, { schema: 'public' })
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('campaigns', { schema: 'public' })
  }
}
