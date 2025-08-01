import Flatted from 'flatted'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES } from '../../libs/constants'

/**
 * Plinko Game Emitter for Emitting things related to the /plinko-game namespace
 *
 * @export
 * @class WalletEmitter
 */
export default class PlinkoGameEmitter {
  static async emitPlinkoGameLightningBoard (payload) {
    try {
      payload = Flatted.parse(Flatted.stringify(payload))
      socketEmitter.of(SOCKET_NAMESPACES.PLINKO_GAME).emit(SOCKET_EMITTERS.PLINKO_GAME_LIGHTNING_BOARD, { data: payload })
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on Plinko Game Lightning Board' })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
