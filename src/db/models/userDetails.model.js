'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserDetails = sequelize.define(
    'UserDetails',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      referralCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      disableReason: {
        type: DataTypes.STRING,
        allowNull: true
      },
      vipTierId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      nextVipTierId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      loginIpAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      newPasswordRequested: {
        type: DataTypes.DATE,
        allowNull: true
      },
      isFirstPurchaseClaimed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      identity: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      customerId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      facebookClickId: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'user_details',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['userId']
        }
      ]
    }
  )

  UserDetails.associate = function (model) {
    UserDetails.belongsTo(model.User, {
      foreignKey: 'userId',
      constraints: false
    })
    UserDetails.belongsTo(model.VipTier, {
      foreignKey: 'vipTierId',
      constraints: false
    })
    UserDetails.belongsTo(model.VipTier, {
      foreignKey: 'nextVipTierId',
      as: 'nextVipTier',
      constraints: false
    })
  }

  return UserDetails
}
