'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserTierProgress = sequelize.define(
    'UserTierProgress',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      vipTierId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      wageringThreshold: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        description: 'Minimum spend amount required for this tier'
      },
      gamesPlayed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        description: 'Minimum total games played to qualify for this tier'
      },
      bigBetsThreshold: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        description: 'Number of bets above a specific amount (defined in the next field)'
      },
      depositsThreshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        description: 'Total deposit amount required to qualify for this tier.'

      },
      loginStreak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        description: 'Consecutive daily logins required for qualification.'

      },
      referralsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        description: 'Minimum number of referrals required to qualify.'

      },
      // sweepstakesEntries: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false,
      //     description: 'Number of sweepstakes entries required for qualification.',

      // },
      // sweepstakesWins: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false,
      //     description: 'Number of sweepstakes wins required for this tier.',

      // },
      // timeBasedConsistency: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false,
      //     description: 'Minimum number of months the player needs to meet spending criteria (e.g., $1,000/month).',

      // },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        description: 'Indicates if this VIP tier is currently active.'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'UserTierProgress',
      tableName: 'user_tier_progress',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'vip_tier_id']
        }
      ]
    }
  )

  UserTierProgress.associate = function (models) {
    UserTierProgress.belongsTo(models.VipTier, { foreignKey: 'vipTierId', as: 'viptier' })
    UserTierProgress.belongsTo(models.User, { foreignKey: 'userId', constraints: false })
  }

  return UserTierProgress
}
