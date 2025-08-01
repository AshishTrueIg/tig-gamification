import { Manager } from 'socket.io-client'
import config from '../configs/app.config'

const userBackendClientManager = new Manager(config.get('user_backend.ws_url'))

export default {
  userBackendClientManager
}
