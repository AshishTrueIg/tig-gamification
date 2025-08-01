import Flatted from 'flatted'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES } from '../../libs/constants'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'

export default class CryptoFutureEmitter {
  static async emitCryptoFutureTickPrice (payload) {
    payload = Flatted.parse(Flatted.stringify(payload))
    try {
      socketEmitter.of(SOCKET_NAMESPACES.CRYPTO_FUTURES).emit(SOCKET_EMITTERS.CRYPTO_FUTURE_TICK, { data: payload })
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on crypto futures' })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitCryptoFutureAutoCashOutBet (payload, userId) {
    try {
      payload = Flatted.parse(Flatted.stringify(payload))
      socketEmitter.of(SOCKET_NAMESPACES.CRYPTO_FUTURES).emit(`${SOCKET_EMITTERS.CRYPTO_FUTURES_GAME_AUTO_CASH_OUT_BET}:${userId}`, { data: payload })
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on RollerCoaster Game Placed Bets' })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
