'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const vipTiers = await queryInterface.bulkInsert('vip_tiers', [
      {

        name: 'Bronze',
        icon: '',
        mobile_icon: '',
        level: 0,
        wagering_threshold: 0,
        games_played: 0,
        big_bets_threshold: 0,
        big_bet_amount: 0,
        deposits_threshold: 0,
        login_streak: 0,
        referrals_count: 0,
        time_based_consistency: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Silver',
        icon: '',
        mobile_icon: '',
        level: 1,
        wagering_threshold: 500,
        games_played: 3,
        big_bets_threshold: 5,
        big_bet_amount: 5,
        deposits_threshold: 1000,
        login_streak: 5,
        referrals_count: 1,
        time_based_consistency: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Gold',
        icon: '',
        mobile_icon: '',
        level: 2,
        wagering_threshold: 800,
        games_played: 5,
        big_bets_threshold: 5,
        big_bet_amount: 10,
        deposits_threshold: 1500,
        login_streak: 7,
        referrals_count: 2,
        time_based_consistency: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Platinum',
        icon: '',
        mobile_icon: '',
        level: 3,
        wagering_threshold: 1000,
        games_played: 6,
        big_bets_threshold: 5,
        big_bet_amount: 12,
        deposits_threshold: 2000,
        login_streak: 9,
        referrals_count: 3,
        time_based_consistency: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Ruby',
        icon: '',
        mobile_icon: '',
        level: 4,
        wagering_threshold: 2500,
        games_played: 7,
        big_bets_threshold: 6,
        big_bet_amount: 15,
        deposits_threshold: 2200,
        login_streak: 12,
        referrals_count: 3,
        time_based_consistency: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Diamond',
        icon: '',
        mobile_icon: '',
        level: 5,
        wagering_threshold: 2600,
        games_played: 8,
        big_bets_threshold: 7,
        big_bet_amount: 18,
        deposits_threshold: 2500,
        login_streak: 15,
        referrals_count: 3,
        time_based_consistency: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pinnacle',
        icon: '',
        mobile_icon: '',
        level: 6,
        wagering_threshold: 3000,
        games_played: 10,
        big_bets_threshold: 10,
        big_bet_amount: 20,
        deposits_threshold: 3000,
        login_streak: 20,
        referrals_count: 3,
        time_based_consistency: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { returning: true })

    // Insert into rewards (one reward per VIP tier)
    const rewards = vipTiers.map((tier) => ({
      vip_tier_id: tier.vip_tier_id, // Foreign key linking to vip_tiers
      cash_bonus: (tier.level + 1) * 10, // Example of deterministic bonus
      commission_rate: 2,
      rackback: 2,
      free_spin: 10,
      created_at: new Date(),
      updated_at: new Date()
    }))

    await queryInterface.bulkInsert('rewards', rewards)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rewards', null, {})
    await queryInterface.bulkDelete('vip_tiers', null, {})
  }
}
