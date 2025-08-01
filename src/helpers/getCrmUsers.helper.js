import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { dayjs } from "@src/libs/dayjs";
import { Logger } from "@src/libs/logger";
import { getCRMSummaryReportQuery } from "@src/helpers/getDailyTransactionSummarySQL.helpers";

export const getUserBySegmentId = async (segmentId) => {

    let fromDate;
    let toDate;

    const makeOps = (expr, value) => ({
        is_equal_to: `${expr} = ${db.sequelize.escape(value)}`,
        is_not_equal_to: `${expr} != ${db.sequelize.escape(value)}`,
        is_greater_than: `${expr} > ${db.sequelize.escape(value)}`,
        is_less_than: `${expr} < ${db.sequelize.escape(value)}`,
        is_between: Array.isArray(value) && value.length === 2
            ? `${expr} BETWEEN ${db.sequelize.escape(value[0])} AND ${db.sequelize.escape(value[1])}`
            : ''
    });

    const getRelativeRange = (daysBack) => ({
        fromDate: dayjs().subtract(daysBack, 'days').toISOString(),
        toDate: dayjs().toISOString()
    });

    const segment = await db.Segment.findOne({
        where: { id: segmentId },
        attributes: ['rules']
    });

    if (!segment) throw new AppError(Errors.SEGMENTS_NOT_FOUND);

    const rules = segment.rules;

    const conditionMap = {
        user_id: (value, operator) => makeOps('u.user_id', value)[operator] || '',
        is_active: (value, operator) => makeOps('u.is_active', value)[operator] || '',
        vip_tier_id: (value, operator) => makeOps('ud.vip_tier_id', value)[operator] || '',
        affiliate_id: (value, operator) => makeOps('u.cx_token', value)[operator] || '',
        timestamp: (value, operator) => makeOps('u.created_at', value)[operator] || '',

        active_last_15_days: (_, operator) => {
            const col = 'u.last_login_date';
            const base = `NOW() - INTERVAL '15 days'`;
            return operator === 'is_equal_to' ? `${col} >= ${base}` : `${col} < ${base}`;
        },

        active_last_30_days: (_, operator) => {
            const col = 'u.last_login_date';
            const base = `NOW() - INTERVAL '30 days'`;
            return operator === 'is_equal_to' ? `${col} >= ${base}` : `${col} < ${base}`;
        },

        active_last_60_days: (_, operator) => {
            const col = 'u.last_login_date';
            const base = `NOW() - INTERVAL '60 days'`;
            return operator === 'is_equal_to' ? `${col} >= ${base}` : `${col} < ${base}`;
        },

        active_last_90_days: (_, operator) => {
            const col = 'u.last_login_date';
            const base = `NOW() - INTERVAL '90 days'`;
            return operator === 'is_equal_to' ? `${col} >= ${base}` : `${col} < ${base}`;
        },

        total_purchase_greater_than_redeem: () => `a.sc_purchased_amount > a.sc_redeemed_amount`,
        total_redeem_greater_than_purchase: () => `a.sc_redeemed_amount > a.sc_purchased_amount`,
        total_purchase_count_equals_zero: () => `a.sc_purchased_count = 0`,
        total_purchase_count: (value, operator) => makeOps('a.sc_purchased_count', value)[operator] || '',
        total_purchase_amount: (value, operator) => makeOps('a.sc_purchased_amount', value)[operator] || '',
        total_redeem: (value, operator) => makeOps('a.sc_redeemed_amount', value)[operator] || '',
        deposit_amount: (value, operator) => makeOps('a.sc_purchased_amount', value)[operator] || '',
        wagered_last_15_days: (value, operator) => makeOps('a.sc_wagered_amount', value)[operator] || '',
        wagered_last_30_days: (value, operator) => makeOps('a.sc_wagered_amount', value)[operator] || '',
        wagered_last_60_days: (value, operator) => makeOps('a.sc_wagered_amount', value)[operator] || '',
        wagered_last_90_days: (value, operator) => makeOps('a.sc_wagered_amount', value)[operator] || '',
        purchase_last_15_days: (value, operator) => makeOps('a.sc_purchased_amount', value)[operator] || '',
        purchase_last_30_days: (value, operator) => makeOps('a.sc_purchased_amount', value)[operator] || '',
        purchase_last_60_days: (value, operator) => makeOps('a.sc_purchased_amount', value)[operator] || '',
        purchase_last_90_days: (value, operator) => makeOps('a.sc_purchased_amount', value)[operator] || '',

        is_self_excluded: (value, operator) => {
            const normalized = String(value).toLowerCase();
            const exists = `EXISTS (SELECT 1 FROM user_limits ul WHERE ul.user_id = u.user_id AND ul.key = 'self_exclusion')`;
            const notExists = `NOT (${exists})`;
            return operator === 'is_equal_to'
                ? (normalized === 'true' ? exists : notExists)
                : operator === 'is_not_equal_to'
                    ? (normalized === 'true' ? notExists : exists)
                    : '';
        }
    };

    const queryParts = rules.conditions.map(({ field, value, operator }) => {
        const fn = conditionMap[field];
        const timeBasedFields = [
            'wagered_last_15_days', 'wagered_last_30_days', 'wagered_last_60_days', 'wagered_last_90_days',
            'purchase_last_15_days', 'purchase_last_30_days', 'purchase_last_60_days', 'purchase_last_90_days'
        ];
        if (timeBasedFields.includes(field)) {
            getRelativeRange(90)
        };

        if (!fn) {
            Logger.info(`function invalid ------- in CRM ${field, value, operator}`)
            throw new Error(`Unsupported filter: ${field}`)
        };
        return fn(value, operator);
    });

    const finalQuery = queryParts.length > 1
        ? queryParts.join(` ${rules.logic} `)
        : queryParts[0];

    const summarySQL = getCRMSummaryReportQuery(fromDate, toDate);
    // const summarySQL = 1

    const baseSQL = `
      WITH combined_user_aggregates AS (
        ${summarySQL}
      )
      SELECT DISTINCT u.user_id, u.username, u.email
      FROM users u
      LEFT JOIN combined_user_aggregates a ON a.user_id = u.user_id
      LEFT JOIN user_details ud ON u.user_id = ud.user_id
      WHERE ${finalQuery}
    `

    const users = await db.sequelize.query(baseSQL, {
        type: db.Sequelize.QueryTypes.SELECT
    });

    return { users };
}
