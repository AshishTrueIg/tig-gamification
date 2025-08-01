import Flatted from 'flatted'
import '../../json-schemas'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '../../libs/constants'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'

/**
 * Wallet Emitter for Emitting things related to the /wallet namespace
 *
 * @export
 * @class WalletEmitter
 */
export default class WalletEmitter {
  static async emitUserWalletBalance (payload, userID) {
    try {
      payload = Flatted.parse(Flatted.stringify(payload))
      const room = SOCKET_ROOMS.WALLET_USER + ':' + userID
      socketEmitter.of(SOCKET_NAMESPACES.WALLET).to(room).emit(SOCKET_EMITTERS.WALLET_USER_WALLET_BALANCE, { data: payload })
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on User Wallet Balance' })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
