import db from '@src/db/models'
// import { getCRMSummaryReportQuery } from "@src/helpers/getDailyTransactionSummarySQL.helpers";
import { BaseHandler } from '@src/libs/baseHandler'
import { dayjs } from '@src/libs/dayjs'
import { ApiHelper } from '@src/utils/api.utils'

export class PreviewSegmentHandler extends BaseHandler {
    makeOps = (expr, value) => ({
      is_equal_to: `${expr} = ${db.sequelize.escape(value)}`,
      is_not_equal_to: `${expr} != ${db.sequelize.escape(value)}`,
      is_greater_than: `${expr} > ${db.sequelize.escape(value)}`,
      is_less_than: `${expr} < ${db.sequelize.escape(value)}`,
      is_between: Array.isArray(value) && value.length === 2
        ? `${expr} BETWEEN ${db.sequelize.escape(value[0])} AND ${db.sequelize.escape(value[1])}`
        : ''
    });

    async run () {
      const { rules, fromDate: fromArg, toDate: toArg } = this.args
      const { offset, limit, pageNo } = ApiHelper.getPagination(this.args.pageNo, this.args.limit)

      const fromDate = fromArg ? dayjs(fromArg) : null
      const toDate = toArg ? dayjs(toArg) : null

      const conditionMap = {
        user_id: (value, operator) => this.makeOps('u.user_id', value)[operator] || '',
        is_active: (value, operator) => this.makeOps('u.is_active', value)[operator] || '',
        vip_tier_id: (value, operator) => this.makeOps('ud.vip_tier_id', value)[operator] || '',
        affiliate_id: (value, operator) => {
          if (operator === 'is_equal_to') {
            return `u.cx_token LIKE ${db.sequelize.escape(value + '%')}`
          }
          if (operator === 'is_not_equal_to') {
            return `u.cx_token NOT LIKE ${db.sequelize.escape(value + '%')} OR u.cx_token IS NULL`
          }
          return this.makeOps('u.cx_token', value)[operator] || ''
        },
        timestamp: (value, operator) => this.makeOps('u.created_at', value)[operator] || '',

        active_last_7_days: (_, operator) => {
          const col = 'u.last_login_date'
          const base = 'NOW() - INTERVAL \'7 days\''
          return operator === 'is_equal_to' ? `${col} >= ${base}` : `${col} < ${base}`
        },

        active_last_15_days: (_, operator) => {
          const col = 'u.last_login_date'
          const base = 'NOW() - INTERVAL \'15 days\''
          return operator === 'is_equal_to' ? `${col} >= ${base}` : `${col} < ${base}`
        },

        active_last_30_days: (_, operator) => {
          const col = 'u.last_login_date'
          const base = 'NOW() - INTERVAL \'30 days\''
          return operator === 'is_equal_to' ? `${col} >= ${base}` : `${col} < ${base}`
        },

        active_last_60_days: (_, operator) => {
          const col = 'u.last_login_date'
          const base = 'NOW() - INTERVAL \'60 days\''
          return operator === 'is_equal_to' ? `${col} >= ${base}` : `${col} < ${base}`
        },

        active_last_90_days: (_, operator) => {
          const col = 'u.last_login_date'
          const base = 'NOW() - INTERVAL \'90 days\''
          return operator === 'is_equal_to' ? `${col} >= ${base}` : `${col} < ${base}`
        },

        total_purchase_greater_than_redeem: () => 'a.sc_purchased_amount > a.sc_redeemed_amount',
        total_redeem_greater_than_purchase: () => 'a.sc_redeemed_amount > a.sc_purchased_amount',
        total_purchase_count_equals_zero: () => 'a.sc_purchased_count = 0',
        total_purchase_count: (value, operator) => this.makeOps('a.sc_purchased_count', value)[operator] || '',
        total_purchase_amount: (value, operator) => this.makeOps('a.sc_purchased_amount', value)[operator] || '',
        total_redeem: (value, operator) => this.makeOps('a.sc_redeemed_amount', value)[operator] || '',
        deposit_amount: (value, operator) => this.makeOps('a.sc_purchased_amount', value)[operator] || '',
        wagered_last_15_days: (value, operator) => this.makeOps('a.sc_wagered_amount', value)[operator] || '',
        wagered_last_30_days: (value, operator) => this.makeOps('a.sc_wagered_amount', value)[operator] || '',
        wagered_last_60_days: (value, operator) => this.makeOps('a.sc_wagered_amount', value)[operator] || '',
        wagered_last_90_days: (value, operator) => this.makeOps('a.sc_wagered_amount', value)[operator] || '',
        purchase_last_15_days: (value, operator) => this.makeOps('a.sc_purchased_amount', value)[operator] || '',
        purchase_last_30_days: (value, operator) => this.makeOps('a.sc_purchased_amount', value)[operator] || '',
        purchase_last_60_days: (value, operator) => this.makeOps('a.sc_purchased_amount', value)[operator] || '',
        purchase_last_90_days: (value, operator) => this.makeOps('a.sc_purchased_amount', value)[operator] || '',

        is_self_excluded: (value, operator) => {
          const normalized = String(value).toLowerCase()
          const exists = 'EXISTS (SELECT 1 FROM user_limits ul WHERE ul.user_id = u.user_id AND ul.key = \'self_exclusion\')'
          const notExists = `NOT (${exists})`
          return operator === 'is_equal_to'
            ? (normalized === 'true' ? exists : notExists)
            : operator === 'is_not_equal_to'
              ? (normalized === 'true' ? notExists : exists)
              : ''
        },

        purchase_greater_than_redeem_by: (value, operator) =>
          this.makeOps('a.sc_purchased_amount - a.sc_redeemed_amount', value)[operator] || '',

        sc_balance: (value, operator) =>
          this.makeOps('w.sc_balance', value)[operator] || ''

      }

      const queryParts = rules.conditions.map(({ field, value, operator }) => {
        const fn = conditionMap[field]
        if (!fn) throw new Error(`Unsupported filter: ${field}`)
        return fn(value, operator)
      })

      const finalQuery = queryParts.length > 1
        ? queryParts.join(` ${rules.logic} `)
        : queryParts[0]

    //   const summarySQL = getCRMSummaryReportQuery(fromDate, toDate);
      const summarySQL = 1

      const baseSQL = `
      WITH combined_user_aggregates AS (
        ${summarySQL}
      ),
      wallet_sc_balances AS (
        SELECT user_id, SUM(balance) AS sc_balance
        FROM wallets
        WHERE currency_code IN ('RSC', 'PSC')
        GROUP BY user_id
      ) 
      SELECT DISTINCT u.user_id, u.username, u.email
      FROM users u
      LEFT JOIN combined_user_aggregates a ON a.user_id = u.user_id
      LEFT JOIN user_details ud ON u.user_id = ud.user_id
      LEFT JOIN wallet_sc_balances w ON w.user_id = u.user_id
      WHERE ${finalQuery}
    `

      const usersCount = await db.sequelize.query(baseSQL, {
        type: db.Sequelize.QueryTypes.SELECT
      })

      const users = await db.sequelize.query(`${baseSQL} LIMIT ${limit} OFFSET ${offset}`, {
        type: db.Sequelize.QueryTypes.SELECT
      })

      return {
        pageNo,
        totalPages: Math.ceil(usersCount.length / limit),
        totalUsersCount: usersCount.length,
        users
      }
    }
}
