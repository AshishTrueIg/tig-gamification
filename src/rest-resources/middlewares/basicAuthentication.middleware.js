import basicAuth from 'express-basic-auth'
import config from '../../configs/app.config'

const basicAuthenticationMiddleware = basicAuth({
  users: { [config.get('basic.username')]: config.get('basic.password') },
  challenge: true
})

export default basicAuthenticationMiddleware
