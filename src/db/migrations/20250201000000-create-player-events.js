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

module.exports = {
  async up(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction()
    
    try {
      await queryInterface.createTable('player_events', {
        event_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'user_id'
          }
        },
        event_type: {
          type: DataTypes.ENUM(...Object.values(PLAYER_EVENT_TYPES)),
          allowNull: false
        },
        event_data: {
          type: DataTypes.JSONB,
          allowNull: false,
          comment: 'Event-specific data (amount, game_id, currency, etc.)'
        },
        session_id: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: 'Gaming session identifier'
        },
        game_id: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: 'Game identifier for gaming events'
        },
        amount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: true,
          comment: 'Transaction amount for financial events'
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: true,
          defaultValue: 'USD'
        },
        device_info: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Device and browser information'
        },
        ip_address: {
          type: DataTypes.INET,
          allowNull: true
        },
        country_code: {
          type: DataTypes.STRING(2),
          allowNull: true
        },
        processed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: 'Whether event has been processed by CRM automation'
        },
        processing_attempts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
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

      // Indexes for performance
      await queryInterface.addIndex('player_events', ['user_id', 'created_at'], {
        name: 'idx_player_events_user_time',
        transaction
      })
      
      await queryInterface.addIndex('player_events', ['event_type', 'created_at'], {
        name: 'idx_player_events_type_time', 
        transaction
      })
      
      await queryInterface.addIndex('player_events', ['processed', 'created_at'], {
        name: 'idx_player_events_processing',
        transaction
      })

      // Partial indexes for better performance
      await queryInterface.addIndex('player_events', ['user_id'], {
        name: 'idx_player_events_financial',
        where: {
          event_type: ['deposit', 'withdrawal', 'win', 'bet']
        },
        transaction
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('player_events', { schema: 'public' })
  }
}