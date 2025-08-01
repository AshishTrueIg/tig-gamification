'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('rewards', {

      reward_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      vip_tier_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cash_bonus: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      commission_rate: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rackback: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      free_spin: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      exclusive_games: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      priority_support: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('rewards', { schema: 'public' })
  }
}
