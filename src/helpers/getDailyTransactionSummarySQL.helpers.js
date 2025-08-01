export const getDailySummaryReportQuery = (userIDs = [], groupByDate = true) => {
  const groupByFields = groupByDate ? 'user_id, date' : 'user_id';
  const groupByClause = `GROUP BY ${groupByFields} ORDER BY ${groupByFields}`;
  const selectDateColumn = groupByDate ? 'date,' : '';

  const userFilter = userIDs.length
    ? `WHERE user_id IN (${userIDs.map(id => Number(id)).join(',')})`
    : '';

  const liveFnCall = userIDs.length
    ? `public.get_user_incremental_aggregate_data(ARRAY[${userIDs.map(id => Number(id)).join(',')}])`
    : `public.get_user_incremental_aggregate_data(NULL)`;

  return `
    WITH historical AS (
      SELECT
        ${groupByDate ? 'user_id, date,' : 'user_id,'}
        SUM(bet_count) AS bet_count,
        SUM(win_count) AS win_count,
        SUM(wagered) AS wagered,
        SUM(won) AS won,
        SUM(total_game_played) AS total_game_played,
        SUM(purchased) AS purchased,
        SUM(purchased_offline) AS purchased_offline,
        SUM(sc_purchased_count) AS sc_purchased_count,
        SUM(redeemed) AS redeemed,
        SUM(redeemed_offline) AS redeemed_offline,
        SUM(sc_coin_purchased) AS sc_coin_purchased,
        SUM(bonus_referral_earned) AS bonus_referral_earned,
        SUM(login_count) AS login_count
      FROM user_transaction_summary_aggregates
      ${userFilter}
      GROUP BY ${groupByFields}
    ),

    live AS (
      SELECT
        ${groupByDate ? 'user_id, date,' : 'user_id,'}
        SUM(bet_count) AS bet_count,
        SUM(win_count) AS win_count,
        SUM(wagered) AS wagered,
        SUM(won) AS won,
        SUM(total_game_played) AS total_game_played,
        SUM(purchased) AS purchased,
        SUM(purchased_offline) AS purchased_offline,
        SUM(sc_purchased_count) AS sc_purchased_count,
        SUM(redeemed) AS redeemed,
        SUM(redeemed_offline) AS redeemed_offline,
        SUM(sc_coin_purchased) AS sc_coin_purchased,
        SUM(bonus_referral_earned) AS bonus_referral_earned,
        SUM(login_count) AS login_count
      FROM ${liveFnCall}
      GROUP BY ${groupByFields}
    ),

    combined AS (
      SELECT * FROM historical
      UNION ALL
      SELECT * FROM live
    )

    SELECT
      user_id,
      ${selectDateColumn}
      SUM(bet_count) AS bet_count,
      SUM(win_count) AS win_count,
      SUM(wagered) AS sc_wagered_amount,
      SUM(won) AS sc_won_amount,
      SUM(total_game_played) AS total_game_played,
      SUM(purchased) AS sc_purchased_amount,
      SUM(purchased_offline) AS sc_purchased_offline,
      SUM(sc_purchased_count) AS sc_purchased_count,
      SUM(redeemed) AS sc_redeemed_amount,
      SUM(redeemed_offline) AS sc_redeemed_offline,
      SUM(sc_coin_purchased) AS sc_coin_purchased,
      SUM(bonus_referral_earned) AS bonus_referral_earned,
      SUM(login_count) AS login_count
    FROM combined
    ${groupByClause}
  `;
};



export const getCRMSummaryReportQuery = (fromDate, toDate) => {
  return `
    SELECT
      user_id,
      SUM(bet_count)             AS bet_count,
      SUM(win_count)             AS win_count,
      SUM(wagered)               AS sc_wagered_amount,
      SUM(won)                   AS sc_won_amount,
      SUM(total_game_played)     AS total_game_played,
      SUM(purchased)             AS sc_purchased_amount,
      SUM(purchased_offline)     AS sc_purchased_offline,
      SUM(sc_purchased_count)    AS sc_purchased_count,
      SUM(redeemed)              AS sc_redeemed_amount,
      SUM(redeemed_offline)      AS sc_redeemed_offline,
      SUM(sc_coin_purchased)     AS sc_coin_purchased,
      SUM(bonus_referral_earned) AS bonus_referral_earned
    FROM (
      SELECT
        user_id,
        bet_count,
        win_count,
        wagered,
        won,
        total_game_played,
        purchased,
        purchased_offline,
        sc_purchased_count,
        redeemed,
        redeemed_offline,
        sc_coin_purchased,
        bonus_referral_earned
      FROM user_transaction_summary_aggregates
      ${fromDate && toDate ? `WHERE date >= '${fromDate}' AND date <= '${toDate}'` : ''}
      UNION ALL
      SELECT
        user_id,
        bet_count,
        win_count,
        wagered,
        won,
        total_game_played,
        purchased,
        purchased_offline,
        sc_purchased_count,
        redeemed,
        redeemed_offline,
        sc_coin_purchased,
        bonus_referral_earned
      FROM public.get_user_incremental_aggregate_data()
    ) combined
    GROUP BY user_id`;
};
