'use strict'

module.exports = function (sequelize, DataTypes) {
  const CampaignSegment = sequelize.define('CampaignSegment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'campaign_id'
    },
    segmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'segment_id'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    tableName: 'campaign_segments',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  CampaignSegment.associate = function (models) {
    CampaignSegment.belongsTo(models.Campaign, {
      foreignKey: 'campaignId',
      targetKey: 'id'
    })

    CampaignSegment.belongsTo(models.Segment, {
      foreignKey: 'segmentId',
      targetKey: 'id'
    })
  }

  return CampaignSegment
}
