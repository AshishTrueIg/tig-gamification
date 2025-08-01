'use strict'

const PLAYER_EVENT_TYPES = {
  LOGIN: 'login',
  SIGNUP: 'signup', 
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  WIN: 'win',
  BET: 'bet',
  REFER: 'refer',
  VIP_TIER_UPGRADE: 'vip_tier_upgrade',
  BONUS_CLAIMED: 'bonus_claimed',
  BONUS_AWARDED: 'bonus_awarded'
}

module.exports = function (sequelize, DataTypes) {
  const PlayerEvent = sequelize.define('PlayerEvent', {
    eventId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      field: 'event_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    eventType: {
      type: DataTypes.ENUM(...Object.values(PLAYER_EVENT_TYPES)),
      allowNull: false,
      field: 'event_type'
    },
    eventData: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'event_data'
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'session_id'
    },
    gameId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'game_id'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: 'USD'
    },
    deviceInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'device_info'
    },
    ipAddress: {
      type: DataTypes.INET,
      allowNull: true,
      field: 'ip_address'
    },
    countryCode: {
      type: DataTypes.STRING(2),
      allowNull: true,
      field: 'country_code'
    },
    processed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    processingAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'processing_attempts'
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
    sequelize,
    tableName: 'player_events',
    schema: 'public',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id', 'created_at']
      },
      {
        fields: ['event_type', 'created_at']
      },
      {
        fields: ['processed', 'created_at']
      }
    ]
  })

  PlayerEvent.associate = function (models) {
    PlayerEvent.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'user_id',
      as: 'user'
    })

    PlayerEvent.belongsTo(models.PlayerSession, {
      foreignKey: 'sessionId',
      targetKey: 'session_id',
      as: 'session'
    })
  }

  return PlayerEvent
}