'use strict'

const TRIGGER_TYPES = {
  EVENT_BASED: 'event_based',
  TIME_BASED: 'time_based',
  CONDITION_BASED: 'condition_based'
}

const TRIGGER_EVENTS = {
  SIGNUP: 'signup',
  FIRST_DEPOSIT: 'first_deposit',
  DEPOSIT: 'deposit',
  BIG_WIN: 'big_win',
  LOSING_STREAK: 'losing_streak',
  INACTIVITY: 'inactivity',
  VIP_UPGRADE: 'vip_upgrade',
  BONUS_CLAIMED: 'bonus_claimed',
  REFERRAL_MADE: 'referral_made',
  SESSION_LENGTH: 'session_length'
}

module.exports = {
  async up(queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction()
    
    try {
      await queryInterface.createTable('campaign_automation_rules', {
        rule_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        campaign_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'campaigns',
            key: 'id'
          }
        },
        rule_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        trigger_type: {
          type: DataTypes.ENUM(...Object.values(TRIGGER_TYPES)),
          allowNull: false
        },
        trigger_event: {
          type: DataTypes.ENUM(...Object.values(TRIGGER_EVENTS)),
          allowNull: true
        },
        conditions: {
          type: DataTypes.JSONB,
          allowNull: false,
          comment: 'Conditions for triggering the campaign'
        },
        delay_hours: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'Delay before sending campaign after trigger'
        },
        max_executions_per_user: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: 'Max times this rule can trigger per user'
        },
        cooldown_hours: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 24,
          comment: 'Minimum hours between triggers for same user'
        },
        target_segments: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Additional segment filtering'
        },
        personalization_rules: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'Rules for personalizing content'
        },
        priority: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 100,
          comment: 'Rule priority for conflict resolution'
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
      await queryInterface.addIndex('campaign_automation_rules', ['campaign_id'], {
        name: 'idx_automation_rules_campaign',
        transaction
      })
      
      await queryInterface.addIndex('campaign_automation_rules', ['trigger_event', 'is_active'], {
        name: 'idx_automation_rules_trigger',
        transaction
      })
      
      await queryInterface.addIndex('campaign_automation_rules', ['is_active', 'priority'], {
        name: 'idx_automation_rules_active_priority',
        transaction
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('campaign_automation_rules', { schema: 'public' })
  }
}