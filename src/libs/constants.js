// SOCKET RELATED
export const SOCKET_NAMESPACES = {
  DEMO: '/demo',
  CRASH_GAME: '/crash-game',
  ROLLER_COASTER_GAME: '/roller-coaster-game',
  WALLET: '/wallet',
  CRYPTO_FUTURES: '/crypto-futures',
  PLINKO_GAME: '/plinko-game'
}

export const SOCKET_EMITTERS = {
  DEMO_HELLO_WORLD: SOCKET_NAMESPACES.DEMO + '/helloWorld',
  WALLET_USER_WALLET_BALANCE: SOCKET_NAMESPACES.WALLET + '/userWalletBalance',
  CRASH_GAME_WAITING_TIMER: SOCKET_NAMESPACES.CRASH_GAME + '/waitingTimer',
  CRASH_GAME_GRAPH_TIMER: SOCKET_NAMESPACES.CRASH_GAME + '/graphTimer',
  CRASH_GAME_ROUND_STARTED: SOCKET_NAMESPACES.CRASH_GAME + '/roundStarted',
  CRASH_GAME_ROUND_STOPPED: SOCKET_NAMESPACES.CRASH_GAME + '/roundStopped',
  CRASH_GAME_ROUND_BETTING_ON_HOLD: SOCKET_NAMESPACES.CRASH_GAME + '/roundBettingOnHold',
  CRASH_GAME_PLACED_BETS: SOCKET_NAMESPACES.CRASH_GAME + '/placedBets',
  CRYPTO_FUTURE_TICK: SOCKET_NAMESPACES.CRYPTO_FUTURES + '/tick',
  CRYPTO_FUTURES_GAME_AUTO_CASH_OUT_BET: SOCKET_NAMESPACES.CRYPTO_FUTURES + '/autoCashOutBets',
  ROLLER_COASTER_GAME_ROUND_STARTED: SOCKET_NAMESPACES.ROLLER_COASTER_GAME + '/roundStarted',
  ROLLER_COASTER_GAME_ROUND_STOPPED: SOCKET_NAMESPACES.ROLLER_COASTER_GAME + '/roundStopped',
  ROLLER_COASTER_GAME_TICK: SOCKET_NAMESPACES.ROLLER_COASTER_GAME + '/tick',
  ROLLER_COASTER_GAME_PLACED_BETS: SOCKET_NAMESPACES.ROLLER_COASTER_GAME + '/placedBets',
  ROLLER_COASTER_GAME_AUTO_CASH_OUT_BET: SOCKET_NAMESPACES.ROLLER_COASTER_GAME + '/autoCashOutBets',
  PLINKO_GAME_LIGHTNING_BOARD: SOCKET_NAMESPACES.PLINKO_GAME + '/lightningBoard'
}

export const SOCKET_LISTENERS = {
  DEMO_HELLO_WORLD: SOCKET_NAMESPACES.DEMO + '/helloWorld'
}

export const SOCKET_ROOMS = {
  WALLET_USER: SOCKET_NAMESPACES.WALLET + '/user', // append id of the user like this /user:1 for one to one,
  ROLLER_COASTER_GAME_USER: SOCKET_NAMESPACES.ROLLER_COASTER_GAME + '/user', // append id of the user like this /user:1 for one to one,
  CRYPTO_FUTURES_INSTRUMENTS: SOCKET_NAMESPACES.CRYPTO_FUTURES + '/instrument', // append id of the user like this /user:1 for one to one,
  DEMO_USER: SOCKET_NAMESPACES.DEMO + '/demo' // append id of the demo like this /demo:1 for one to one
}
// SOCKET RELATED

export const USER_TYPES = {
  BOT: 'BOT',
  USER: 'USER',
  ADMIN: 'ADMIN',
  INFLUENCER: 'INFLUENCER'
}

export const GAMES = {
  DICE: 'dice',
  CRASH: 'crash',
  ROLLER_COASTER: 'roller-coaster',
  CRYPTO_FUTURES: 'crypto-futures'
}

export const BET_RESULT = {
  WON: 'won',
  LOST: 'lost',
  CANCELLED: 'cancelled'
}

export const BET_STATUS = {
  CASHED_OUT: 'cashedOut',
  PLACED: 'placed',
  BUSTED: 'busted'
}

export const CRASH_GAME_STATE = {
  STARTED: '1',
  ON_HOLD: '2',
  GRAPH_FINISHED: '3',
  STOPPED: '0'
}

export const ROLLER_COASTER_GAME_STATE = {
  STOPPED: '0',
  STARTED: '1'
}

export const DEFAULT_GAME_ID = {
  CRASH: 1,
  HILO: 2,
  MINE: 3,
  COINFLIP: 4,
  PLINKO: 5,
  ROLLER_COASTER: 6,
  CRYPTO_FUTURES: 7
}

export const AFFILIATE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
}

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  REFUND: 'refund',
  BET: 'bet',
  WIN: 'win',
  ROLLBACK: 'rollback',
  FLAT_FEE: 'flat-fee',
  PNL_FEE: 'pnl-fee',
  FEE: 'fee'
}

export const PAYMENT_METHODS = {
  GAME: 'game',
  COIN_PAYMENT: 'coinPayment',
  BONUS: 'bonus',
  MANUAL_DEPOSIT: 'manual_deposit'
}

export const VENDORS = {
  MAILGUN: 'MAILGUN',
  SENDGRID: 'SENDGRID'
}

export const JOINING_BONUS_STATUS = {
  TRUE: true,
  FALSE: false
}

export const REFERRAL_BONUS_STATUS = {
  TRUE: true,
  FALSE: false
}

export const BONUS_TYPES = {
  REGISTRATION: 'registration',
  DAILY: 'daily',
  MONTHLY: 'monthly',
  WEEKLY: 'weekly',
  DEPOSIT: 'deposit',
  REFERRAL: 'referral',
  FREESPINS: 'freespins',
  WEEKLYSPLITTED: 'weeklysplitted',
  CASHBACK: 'cashback'
}

export const BONUS_STATUS = {
  ACTIVE: 'active',
  CLAIMED: 'claimed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  FORFEIT: 'forfeit',
  READY_TO_CLAIM: 'readyToClaim'
}

export const WAGERING_STATUS = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  REQUESTED: 'REQUESTED',
  RE_REQUESTED: 'RE-REQUESTED',
  ACTIVE: 'ACTIVE',
  COMPLETE: 'COMPLETE'
}

export const CRYPTO_FUTURES_INSTRUMENTS = {
  BINANCE_TRADE: {
    BTC: 'btcusdt@miniTicker',
    ETH: 'ethusdt@miniTicker',
    DOGE: 'dogeusdt@miniTicker',
    LTC: 'ltcusdt@miniTicker',
    BNB: 'bnbusdt@miniTicker',
    XRP: 'xrpusdt@miniTicker',
    LINK: 'linkusdt@miniTicker',
    SOL: 'solusdt@miniTicker',
    ADA: 'adausdt@miniTicker',
    TRX: 'trxusdt@miniTicker',
    DOT: 'dotusdt@miniTicker',
    MATIC: 'maticusdt@miniTicker',
    APE: 'apeusdt@miniTicker',
    APT: 'aptusdt@miniTicker',
    FTM: 'ftmusdt@miniTicker',
    ZEC: 'zecusdt@miniTicker',
    ARB: 'arbusdt@miniTicker',
    BCH: 'bchusdt@miniTicker',
    WLD: 'wldusdt@miniTicker',
    AVAX: 'avaxusdt@miniTicker',
    MEME: 'memeusdt@miniTicker',
    INJ: 'injusdt@miniTicker',
    KAS: 'kasusdt@miniTicker',
    BLUR: 'blurusdt@miniTicker',
    PYTH: 'pythusdt@miniTicker',
    SEI: 'seiusdt@miniTicker',
    TIA: 'tiausdt@miniTicker',
    '1000PEPE': '1000pepeusdt@miniTicker',
    '1000BONK': '1000bonkusdt@miniTicker',
    '1000SHIB': '1000shibusdt@miniTicker'
  }
}

export const CRYPTO_FUTURE_URL = {
  BINANCE: 'wss://stream.binance.com:9443/ws'
}

export const DEFAULT_PLINKO_LIGHTNING_MODE_BET_MUTLIPLIERS = [10, 20, 30]

export const DEFAULT_PLINKO_LIGHTNING_MODE_BOARD = {
  betMultipliers: [{ position: [7, 8], multiplier: '2x' }, { position: [13, 10], multiplier: '15x' }, { position: [2, 2], multiplier: '40x' }],
  payouts: [1000, 155, 6.28, 1.09, 0.35, 0.16, 0, 0.02, 0, 0.01, 0, 0.07, 0.3, 1.4, 29.3, 157, 1000]
}

export const PLINKO_LIGHTNING_MODE_VARIABLE_ODDS = {
  1: [500, 125, 30, 5, 0.9, 0.3, 0, 0.1, 0, 0.1, 0, 0.3, 0.9, 5, 30, 125, 500],
  2: [1000, 155, 15, 3.59, 1.4, 0.69, 0, 0.07, 0, 0.04, 0, 0.17, 0.25, 0.46, 1.27, 8.43, 1000],
  3: [1000, 155, 6.28, 1.09, 0.35, 0.16, 0, 0.02, 0, 0.01, 0, 0.07, 0.3, 1.4, 29.3, 157, 1000],
  4: [1000, 6.39, 0.96, 0.32, 0.16, 0.09, 0, 0.02, 0, 0.03, 0, 0.61, 2.03, 7.42, 28.7, 152, 1000]
}

export const SETTLEMENT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending'
}

export const EAR_ACTION_TYPE = {
  BET: 'casino-bet',
  WIN: 'casino-win',
  BONUS_BET: 'casino-bonus-bet',
  BONUS_WIN: 'casino-bonus-win',
  DEBIT: 'debit',
  CREDIT: 'credit'
}

export const INSTRUMENTS_USDT_SYMBOL = {
  BTCUSDT: 'BTC',
  ETHUSDT: 'ETH',
  DOGEUSDT: 'DOGE',
  LTCUSDT: 'LTC',
  BNBUSDT: 'BNB',
  XRPUSDT: 'XRP',
  LINKUSDT: 'LINK',
  SOLUSDT: 'SOL',
  ADAUSDT: 'ADA',
  TRXUSDT: 'TRX',
  DOTUSDT: 'DOT',
  MATICUSDT: 'MATIC',
  APEUSDT: 'APE',
  APTUSDT: 'APT',
  FTMUSDT: 'FTM',
  ZECUSDT: 'ZEC',
  ARBUSDT: 'ARB',
  BCHUSDT: 'BCH',
  WLDUSDT: 'WLD',
  AVAXUSDT: 'AVAX',
  MEMEUSDT: 'MEME',
  INJUSDT: 'INJ',
  KASUSDT: 'KAS',
  BLURUSDT: 'BLUR',
  PYTHUSDT: 'PYTH',
  SEIUSDT: 'SEI',
  TIAUSDT: 'TIA',
  '1000PEPEUSDT': '1000PEPE',
  '1000BONKUSDT': '1000BONK',
  '1000SHIBUSDT': '1000SHIB'
}
