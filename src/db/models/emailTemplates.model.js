'use strict'

import { TEMPLATE_TYPES } from '@src/utils/constants/sendgrid.constants'

module.exports = function (sequelize, DataTypes) {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    emailTemplateId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    templateProviderId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(...Object.values(TEMPLATE_TYPES)),
      allowNull: false,
      defaultValue: TEMPLATE_TYPES.GENERAL
    }
  }, {
    sequelize,
    tableName: 'email_templates',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return EmailTemplate
}
