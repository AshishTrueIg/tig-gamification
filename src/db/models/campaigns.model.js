'use strict'

// const { CRM_CAMPAIGN_STATUS } = require('../../utils/constants/crm.constants')
import { CRM_CAMPAIGN_STATUS } from '@src/utils/constants/crm.constants'

module.exports = function (sequelize, DataTypes) {
  const Campaign = sequelize.define('Campaign', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    templateId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'SendGrid email template ID'
    },
    status: {
      type: DataTypes.ENUM(...Object.values(CRM_CAMPAIGN_STATUS)),
      allowNull: false,
      defaultValue: CRM_CAMPAIGN_STATUS.DRAFT
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    daysOfWeek: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: null
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'campaigns',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Campaign.associate = function (models) {
    Campaign.belongsToMany(models.Segment, {
      through: 'campaign_segments',
      foreignKey: 'campaign_id',
      otherKey: 'segment_id'
    })
  }

  return Campaign
}
