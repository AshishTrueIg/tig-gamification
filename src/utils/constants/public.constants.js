// export const COINS = {
//   GOLD_COIN: "GC",
//   SWEEP_COIN: {
//     BONUS_SWEEP_COIN: "BSC",
//     PURCHASE_SWEEP_COIN: "PSC",
//     REDEEMABLE_SWEEP_COIN: "RSC",
//   },
//   SWEEP_COINS: 'SC'
// };

// export const PST_TIMEZONE = 'America/Los_Angeles'

// export const CACHE_KEYS = {
//   STATE_CODES: "inactiveStateCode",
//   STATES: "inactiveStates",
//   PACKAGES_NORMAL: 'cache:packages:normal', //done
//   PACKAGES_WELCOME: 'cache:packages:welcome', //done
//   BANNERS: 'cache:banners', //done
//   PAGES: 'cache:pages', //done
//   SETTINGS: 'cache:settings', //done
//   VIP: 'cache:vip', // done
//   PROMOTIONS: 'cache:promotions', //done
//   WHEEL_CONFIG: 'cache:wheel-configs', //done
//   IP_ADDRESSES: 'cache:ip-addresses'
// };

// export const PROMOTIONS_TYPE = {
//   CASINO_PROMOTIONS: "casino_promotions",
//   SPONSORSHIPS: "sponsorships",
// };

// export const GLOBAL_SETTINGS = {
//   SITE_INFORMATION: "SITE_INFORMATION",
//   FAUCET: "FAUCET",
//   WITHDRAWAL_LIMITS: "WITHDRAWAL_LIMITS",
//   SOCIAL_MEDIA_LINKS: "SOCIAL_MEDIA_LINKS",
//   KILL_SWITCH: "KILL_SWITCH",
//   DEPOSIT_LIMITS: "DEPOSIT_LIMITS",
//   SITE_SETTINGS: "SITE_SETTINGS",
//   GLOBAL_DAILY_WITHDRAWAL_ALLOWED: "GLOBAL_DAILY_WITHDRAWAL_ALLOWED"
// };

// export const CMS_CATEGORIES = {
//   SUPPORT: "support", // FAQ, Fairness, Gaming Helpline, Live Support, VIP Rules
//   LEGAL_COMPLIANCE: "legal_compliance", // Terms & Conditions, Privacy Policy, Responsible Gaming
//   HOW_TO_GUIDES: "how_to_guides", // Social Casino Guide, Slot Game Guide, Live Dealer Guide
// };

// export const JWT_TOKEN_TYPES = {
//   LOGIN: "login",
//   FORGOT_PASSWORD: "forgot_password",
// };

// export const BANNER_TYPE = {
//   HOME: "home",
//   CASINO: "casino",
//   PROMOTION: "promotion",
//   REGISTRATION: "registration",
//   REFFERFRIEND: "reffer_friend",
//   OTHER: "other",
//   VIP: "vip",
//   STORE: "store",
// };

// export const DEVICE_TYPE = {
//   MOBILE: "mobile",
//   DESKTOP: "desktop",
//   BOTH: "both",
// };

// export const SOCKET_NAMESPACES = {
//   WALLET: "/wallet",
//   LEADER_BOARD: "/leader-board",
//   ACCOUNT_CAPTURE: "/accountCapture",
//   CASINO_BETS: '/casino-bets'
// };

// export const SOCKET_EMITTERS = {
//   USER_WALLET_BALANCE: "USER_WALLET_BALANCE",
//   LEADER_BOARD: "LEADER_BOARD",
//   ACCOUNT_CAPTURE: "ACCOUNT_CAPTURE",
//   USER_TRANSACTION: "USER_USER_TRANSACTION",
// };

// export const SOCKET_LISTENERS = {
//   USER_WALLET_BALANCE: SOCKET_NAMESPACES.WALLET + "/balance",
// };

// export const SOCKET_ROOMS = {
//   LEADER_BOARD: "LEADER_BOARD",
//   USER_WALLET: "USER_WALLET",
//   CASINO_BETS: 'CASINO_BETS',
//   ACCOUNT_CAPTURE: "ACCOUNT_CAPTURE",
// };

// const ASSETS = "sweeps/assets";

// export const S3_FILE_PREFIX = {
//   bonus: ASSETS + "/bnonus",
//   packages: ASSETS + "/sweeps/packages",
//   casino_game: ASSETS + "/casino/games",
//   casino_provider: ASSETS + "/casino/providers",
//   casino_category: ASSETS + "/casino/categories",
//   promotions: ASSETS + "/promotions",
//   siteLogo: ASSETS + "/site_information/logo",
//   banner: ASSETS + "/site_information/banner",
//   site_information: ASSETS + "/site_information",
//   imageGallery: ASSETS + "/gallery",
//   vipTier: ASSETS + "/vip_tier/icon",
//   popup: ASSETS + "/popup",
// };

// export const TRANSACTION_PURPOSE = {
//   // General transactions
//   PURCHASE: "purchase",
//   REDEEM: "redeem",
//   REDEEM_REFUND: "redeem_refund",

//   // Bonus transactions
//   BONUS_CASH: "bonus_cash",
//   BONUS_DEPOSIT: "bonus_deposit",
//   BONUS_REFERRAL: "bonus_referral",
//   BONUS_TO_CASH: "bonus_to_cash",
//   BONUS_FORFEIT: "bonus_forfeit",
//   BONUS_WIN: "bonus_win",
//   BONUS_DROP: "bonus_drop",
//   POSTAL_CODE: "postal_code",
//   BONUS_RACKBACK: "bonus_rackback",
//   WELCOME_BONUS: "welcome_bonus",
//   // Faucet transactions
//   FAUCET_AWAIL: "faucet_awail",

//   // Spin Wheel transaction
//   WHEEL_REWARD: "wheel_reward",

//   // Chatrain transaction
//   EMIT: "emit_chatrain",
//   CHATRAIN: "chatrain",
//   CLAIM: "claim_chatrain",

//   //Tip transaction
//   SEND_TIP: "send_tip",
//   RECEIVE_TIP: "receive_tip",
//   TIP: "tip",
//   //VIP
//   VIP_REWARDED: "vip_rewarded",

//   WEEKLY_COMMISION: 'weekly_commission',
//   WEEKLY_CASHBACK: 'weekly_cashback',

//   //Expire
//   SC_EXPIRED: 'sc_expired',
//   CASHBACK_EXPIRED: 'cashback_expired'
// };

// // Casino transactions
// export const CASINO_TRANSACTION_PURPOSE = {
//   CASINO_BET: "casino_bet",
//   CASINO_REFUND: "casino_refund",
//   CASINO_WIN: "casino_win",
//   JACKPOT_WIN: "jackpot_win",
//   PROMO_WIN: "promo_win",
//   BONUS_DROP: "bonus_drop",
//   BONUS_RACKBACK: "bonus_rackback",
//   POSTAL_CODE: "postal_code",
//   GAME_ROLLBACK: "game_rollback",
// };

// export const POSTAL_CODE_STATUS = {
//   PENDING: "PENDING",
//   APPROVED: "APPROVED",
//   REJECTED: "REJECTED",
// };

// export const LEDGER_TYPES = {
//   DEBIT: "Debit",
//   CREDIT: "Credit",
// };

// export const TRANSACTION_STATUS = {
//   PENDING: "pending",
//   SUCCESS: "successful",
//   FAILED: "failed",
//   CANCELLED: "cancelled",
//   ROLLBACK: "rollback",
//   APPROVED: "approved",
//   REJECTED: "rejected",
// };

// export const LEDGER_TRANSACTION_TYPES = {
//   CASINO: "casino",
//   BANKING: "banking",
//   WITHDRAW: "withdraw",
// };

// export const LEDGER_DIRECTIONS = {
//   [TRANSACTION_PURPOSE.PURCHASE]: LEDGER_TYPES.CREDIT,
//   [TRANSACTION_PURPOSE.REDEEM]: LEDGER_TYPES.DEBIT,
//   [TRANSACTION_PURPOSE.REDEEM_REFUND]: LEDGER_TYPES.CREDIT,
//   [CASINO_TRANSACTION_PURPOSE.CASINO_BET]: LEDGER_TYPES.DEBIT,
//   [CASINO_TRANSACTION_PURPOSE.CASINO_WIN]: LEDGER_TYPES.CREDIT,
//   [CASINO_TRANSACTION_PURPOSE.CASINO_REFUND]: LEDGER_TYPES.CREDIT,
//   [CASINO_TRANSACTION_PURPOSE.BONUS_DROP]: LEDGER_TYPES.CREDIT,
//   [CASINO_TRANSACTION_PURPOSE.BONUS_RACKBACK]: LEDGER_TYPES.CREDIT,
//   [CASINO_TRANSACTION_PURPOSE.POSTAL_CODE]: LEDGER_TYPES.CREDIT,
//   [TRANSACTION_PURPOSE.FAUCET_AWAIL]: LEDGER_TYPES.CREDIT,
//   [TRANSACTION_PURPOSE.WHEEL_REWARD]: LEDGER_TYPES.CREDIT,
//   [TRANSACTION_PURPOSE.EMIT]: LEDGER_TYPES.DEBIT,
//   [TRANSACTION_PURPOSE.CLAIM]: LEDGER_TYPES.CREDIT,
//   [TRANSACTION_PURPOSE.SEND_TIP]: LEDGER_TYPES.DEBIT,
//   [TRANSACTION_PURPOSE.RECEIVE_TIP]: LEDGER_TYPES.CREDIT,
//   [TRANSACTION_PURPOSE.WEEKLY_CASHBACK]: LEDGER_TYPES.CREDIT,
//   [TRANSACTION_PURPOSE.WEEKLY_COMMISION]: LEDGER_TYPES.CREDIT,
// };

// export const WITHDRAWAL_STATUS = {
//   PENDING: "Pending",
//   SUCCESS: "Success",
//   CANCELLED: "Cancelled",
// };

// export const TICKET_STATUSES = {
//   OPEN: "open",
//   ACTIVE: "active",
//   RESOLVED: "resolved",
//   CLOSED: "closed",
// };

// export const PAYMENT_PROVIDER = {
//   LIMINAL: "Liminal",
//   NOWPAYMENT: "NowPayment",
//   OFFLINE: "Offline",
//   CENTRY_OS: "CentryOS",
//   APT_PAY: "apt_pay",
//   FYNTEK: "fyntek",
//   LINK_MONEY: "linkMoney"
// };

// const GENDER = {
//   MALE: "Male",
//   FEMALE: "Female",
//   TRANSGENDER: "Transgender",
// };

// module.exports = GENDER

// export const VERIFF_STATUS = {
//   PENDING: "pending",
//   REVIEW: 'review',
//   REQUESTED: "requested",
//   APPROVED: "approved",
//   EXPIRED: 'expired',
//   ABANDONED: 'abandoned',
//   DECLINED: "declined",
//   RESUBMISSION: "resubmission_requested",
//   ADMIN_BLOCK: "admin_block",
//   ADMIN_APPROVED: "admin_approved"
// };

// export const DOCUMENT_TYPES = {
//   VERIFF: "veriff",
//   OTHER: "other",
// };
// export const DOCUMENT_STATUS_TYPES = {
//   PENDING: "pending",
//   APPROVED: "approved",
//   REJECTED: "rejected",
//   REQUESTED: "requested",
// };

// export const EMAIL_NAME = {
//   FORGET_PASSWORD: "forget_password",
//   VERIFY_EMAIL: "verify_email",
// }

// export const BONUS_PURPOSES = [
//   TRANSACTION_PURPOSE.BONUS_CASH,
//   TRANSACTION_PURPOSE.BONUS_DROP,
//   TRANSACTION_PURPOSE.BONUS_RACKBACK,
//   TRANSACTION_PURPOSE.WEEKLY_CASHBACK,
//   TRANSACTION_PURPOSE.WEEKLY_COMMISION,
//   TRANSACTION_PURPOSE.WHEEL_REWARD,
//   TRANSACTION_PURPOSE.WELCOME_BONUS,
//   TRANSACTION_PURPOSE.POSTAL_CODE
// ]

export const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
  TRANSGENDER: 'Transgender'
}
