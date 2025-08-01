'use strict'

module.exports = {
  async up(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction()
    
    try {
      await queryInterface.createTable('player_sessions', {
        session_id: {
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
        started_at: {
          type: DataTypes.DATE,
          allowNull: false
        },
        ended_at: {
          type: DataTypes.DATE,
          allowNull: true
        },
        duration_seconds: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: 'Session duration in seconds'
        },
        total_bets: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        total_wagered: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.00
        },
        total_won: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.00
        },
        net_result: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.00,
          comment: 'Net win/loss for the session'
        },
        games_played: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Array of game IDs played during session'
        },
        device_info: {
          type: DataTypes.JSONB,
          allowNull: true
        },
        ip_address: {
          type: DataTypes.INET,
          allowNull: true
        },
        country_code: {
          type: DataTypes.STRING(2),
          allowNull: true
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
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
      }, { 
        schema: 'public', 
        transaction 
      })

      // Indexes
      await queryInterface.addIndex('player_sessions', ['user_id', 'started_at'], {
        name: 'idx_player_sessions_user_time',
        transaction
      })
      
      await queryInterface.addIndex('player_sessions', ['is_active'], {
        name: 'idx_player_sessions_active',
        transaction
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('player_sessions', { schema: 'public' })
  }
}