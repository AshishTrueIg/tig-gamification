import models, { sequelize } from '../db/models'
import { WebSocket } from 'ws'
import ServiceBase from '../libs/serviceBase'
// import { JOB_CRYPTO_FUTURES_RESOLVE_TICK_PRICE, cryptoFuturesGameQueue } from '../queues/cryptoFutures.queue'
// import GetAllCryptoFuturesInstruments from '../services/game/cryptoFutures/getAllCryptoFuturesInstrumentsMessage.service'
import { CRYPTO_FUTURE_URL } from '../libs/constants'

export default class AttachOneTimeListeners extends ServiceBase {
  async run () {
    try {
      const ws = new WebSocket(CRYPTO_FUTURE_URL.BINANCE)

      // const cryptoFuturesInstrumentsMessage = await GetAllCryptoFuturesInstruments.run({}, { dbModels: models, sequelize })

      // const message = JSON.stringify({
      //   method: 'SUBSCRIBE',
      //   params: cryptoFuturesInstrumentsMessage,
      //   id: Math.floor((Math.random() * 10000) + 1)
      // })

      // ws.on('open', async (data) => {
      //   ws.send(message)
      // })

      // ws.on('message', async (data) => {
      //   const tickPrice = JSON.parse(data.toString())
      //   await cryptoFuturesGameQueue.add(JOB_CRYPTO_FUTURES_RESOLVE_TICK_PRICE, {
      //     id: tickPrice.E,
      //     tickPrice
      //   }, {
      //     priority: 1,
      //     jobId: `${JOB_CRYPTO_FUTURES_RESOLVE_TICK_PRICE}: Symbol-${tickPrice.s} Time-${tickPrice.E}`
      //   })
      // })
      return true
    } catch (error) {
      throw Error(error)
    }
  }
}
