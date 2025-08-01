import Flatted from 'flatted'
import APIError from '../../errors/api.error'
import { validateData } from '../../helpers/ajv.helpers'
import '../../json-schemas'
import ajv from '../../libs/ajv'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES } from '../../libs/constants'
import { SocketResponseValidationErrorType } from '../../libs/errorTypes'
import Logger from '../../libs/logger'
import socketEmitter from '../../libs/socketEmitter'

const rollerCoasterGamePlacedBetsSchema = {
  type: 'array',
  items: {
    $ref: '/rollerCoasterGameBet.json#'
  }
}

const rollerCoasterGameRoundSchema = {
  $ref: '/rollerCoasterGameRoundDetail.json#'
}

const rollerCoasterGameRoundStartedSchema = {
  type: 'object',
  properties: {
    id: { $ref: '/rollerCoasterGameRoundDetail.json#/properties/id' },
    roundId: { $ref: '/rollerCoasterGameRoundDetail.json#/properties/roundId' },
    roundState: { $ref: '/rollerCoasterGameRoundDetail.json#/properties/roundState' },
    roundSignature: { $ref: '/rollerCoasterGameRoundDetail.json#/properties/roundSignature' },
    createdAt: { $ref: '/rollerCoasterGameRoundDetail.json#/properties/createdAt' }
  }
}

const rollerCoasterGameTickSchema = {
  $ref: '/rollerCoasterGameTick.json#'
}

ajv.addSchema(rollerCoasterGameTickSchema, 'emitRollerCoasterGameTick')
ajv.addSchema(rollerCoasterGameRoundStartedSchema, 'emitRollerCoasterGameRoundStarted')
ajv.addSchema(rollerCoasterGameRoundSchema, 'emitRollerCoasterGameRoundStopped')
ajv.addSchema(rollerCoasterGamePlacedBetsSchema, 'emitRollerCoasterGamePlacedBets')

/**
 * RollerCoaster Game Emitter for Emitting things related to the /roller-coaster-game namespace
 *
 * @export
 * @class RollerCoasterGameEmitter
 */
export default class RollerCoasterGameEmitter {
  static async emitRollerCoasterGameTick (payload) {
    payload = Flatted.parse(Flatted.stringify(payload))
    try {
      const [isValid, errors] = validateData('emitRollerCoasterGameTick', payload)
      if (isValid) {
        socketEmitter.of(SOCKET_NAMESPACES.ROLLER_COASTER_GAME).emit(SOCKET_EMITTERS.ROLLER_COASTER_GAME_TICK, { data: payload })
      } else {
        Logger.info(SocketResponseValidationErrorType.name, { message: SocketResponseValidationErrorType.description, fault: errors })
        socketEmitter.of(SOCKET_NAMESPACES.CRASH_GAME).emit(SOCKET_EMITTERS.ROLLER_COASTER_GAME_TICK, new APIError())
      }
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on RollerCoaster Game Waiting Timer' })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitRollerCoasterGamePlacedBets (payload) {
    try {
      payload = Flatted.parse(Flatted.stringify(payload))
      const [isValid, errors] = validateData('emitRollerCoasterGamePlacedBets', payload)
      if (isValid) {
        socketEmitter.of(SOCKET_NAMESPACES.ROLLER_COASTER_GAME).emit(SOCKET_EMITTERS.ROLLER_COASTER_GAME_PLACED_BETS, { data: payload })
      } else {
        Logger.info('Error In Emitter', { message: 'Validation Error', fault: errors })
        socketEmitter.of(SOCKET_NAMESPACES.CRASH_GAME).emit(SOCKET_EMITTERS.ROLLER_COASTER_GAME_PLACED_BETS, new APIError())
      }
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on RollerCoaster Game Placed Bets' })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitRollerCoasterGameRoundStarted (payload) {
    try {
      payload = Flatted.parse(Flatted.stringify(payload))
      const [isValid, errors] = validateData('emitRollerCoasterGameRoundStarted', payload)
      if (isValid) {
        socketEmitter.of(SOCKET_NAMESPACES.ROLLER_COASTER_GAME).emit(SOCKET_EMITTERS.ROLLER_COASTER_GAME_ROUND_STARTED, { data: payload })
      } else {
        Logger.info('Error In Emitter', { message: 'Validation Error', fault: errors })
      }
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on RollerCoaster Game Round Started' })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitRollerCoasterGameRoundStopped (payload) {
    try {
      payload = Flatted.parse(Flatted.stringify(payload))
      const [isValid, errors] = validateData('emitRollerCoasterGameRoundStopped', payload)
      if (isValid) {
        socketEmitter.of(SOCKET_NAMESPACES.ROLLER_COASTER_GAME).emit(SOCKET_EMITTERS.ROLLER_COASTER_GAME_ROUND_STOPPED, { data: payload })
      } else {
        Logger.info('Error In Emitter', { message: 'Validation Error', fault: errors })
      }
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on RollerCoaster Game Round Stopped' })
      Logger.info('Actual Error', { exception: error })
    }
  }

  static async emitRollerCoasterGameAutoCashOutBet (payload, userId) {
    try {
      payload = Flatted.parse(Flatted.stringify(payload))
      // const [isValid, errors] = validateData('emitRollerCoasterGamePlacedBets', payload)
      // if (isValid) {
      const emit = SOCKET_EMITTERS.ROLLER_COASTER_GAME_AUTO_CASH_OUT_BET + ':' + userId
      socketEmitter.of(SOCKET_NAMESPACES.ROLLER_COASTER_GAME).emit(emit, { data: payload })
      // } else {
      //   Logger.info('Error In Emitter', { message: 'Validation Error', fault: errors })
      // }
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on RollerCoaster Game Placed Bets' })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
