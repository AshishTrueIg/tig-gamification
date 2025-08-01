'use strict'

module.exports = function (sequelize, DataTypes) {
  const Segment = sequelize.define('Segment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rules: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    tableName: 'segments',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Segment.associate = function (models) {
    Segment.belongsToMany(models.Campaign, {
      through: 'campaign_segments',
      foreignKey: 'segment_id',
      otherKey: 'campaign_id'
    })

    Segment.belongsToMany(models.User, {
      through: 'user_segments',
      foreignKey: 'segment_id',
      otherKey: 'user_id',
      as: 'users'
    })
  }

  return Segment
}
