'use strict'

module.exports = {
  async up(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction()
    
    try {
      await queryInterface.createTable('player_statistics', {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          references: {
            model: 'users',
            key: 'user_id'
          }
        },
        // Financial Metrics
        total_deposited: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.00
        },
        total_withdrawn: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.00
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
          defaultValue: 0.00
        },
        largest_win: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.00
        },
        largest_loss: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.00
        },
        
        // Gaming Activity Metrics
        total_bets: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        total_wins: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        total_sessions: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        total_playtime_minutes: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        avg_session_duration: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'Average session duration in minutes'
        },
        
        // Time-based Metrics
        days_since_signup: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        days_since_last_login: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        days_since_last_deposit: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        days_since_last_bet: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        login_streak_current: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        login_streak_longest: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        
        // Referral Metrics
        referrals_count: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        successful_referrals: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'Referrals who made at least one deposit'
        },
        
        // Bonus Metrics
        total_bonuses_claimed: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        total_bonus_amount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0.00
        },
        
        // Risk Assessment
        churn_risk_score: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'Churn risk score 0-100'
        },
        spending_propensity: {
          type: DataTypes.ENUM('low', 'medium', 'high'),
          allowNull: false,
          defaultValue: 'low'
        },
        
        // Gaming Patterns
        favorite_games: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Top 5 most played games with play counts'
        },
        gaming_patterns: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Playing patterns, peak hours, etc.'
        },
        
        last_calculated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
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

      // Indexes for segmentation queries
      await queryInterface.addIndex('player_statistics', ['total_deposited'], {
        name: 'idx_player_stats_total_deposited',
        transaction
      })
      
      await queryInterface.addIndex('player_statistics', ['days_since_last_login'], {
        name: 'idx_player_stats_last_login',
        transaction
      })
      
      await queryInterface.addIndex('player_statistics', ['churn_risk_score'], {
        name: 'idx_player_stats_churn_risk',
        transaction
      })
      
      await queryInterface.addIndex('player_statistics', ['spending_propensity'], {
        name: 'idx_player_stats_spending_propensity',
        transaction
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('player_statistics', { schema: 'public' })
  }
}