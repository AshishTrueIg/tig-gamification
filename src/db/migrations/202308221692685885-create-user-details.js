'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('user_details', {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        address: {
          type: DataTypes.STRING,
          allowNull: true
        },
        disable_reason: {
          type: DataTypes.STRING,
          allowNull: true
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE
        },
        vip_tier_id: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        next_vip_tier_id: {
          allowNull: false,
          type: DataTypes.INTEGER
        },
        ip_address: {
          type: DataTypes.STRING,
          allowNull: true
        },
        login_ip_address: {
          type: DataTypes.STRING,
          allowNull: true
        },
        new_password_requested: {
          type: DataTypes.DATE,
          allowNull: true
        },
        is_first_purchase_claimed: {
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
        postal_code: {
          type: DataTypes.STRING,
          allowNull: true
        }
      }, {
        schema: 'public',
        transaction
      })
      await queryInterface.addIndex('user_details', ['user_id'], {
        name: 'index_user_details_on_user_id',
        transaction
      })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.dropTable('user_details', { schema: 'public' })
  }
}
