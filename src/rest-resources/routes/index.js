import express from 'express'
import onHealthCheck from '../../libs/onHealthCheck'
import basicAuthenticationMiddleware from '../middlewares/basicAuthentication.middleware'
import apiRouter from './api'
import dashboardRoutes from './dashboard.routes'

const router = express.Router()

router.use('/dashboard', dashboardRoutes)
router.use('/api', apiRouter)

router.get('/health-check', async (req, res, next) => {
  try {
    const response = await onHealthCheck()
    res.json(response)
  } catch (error) {
    res.status(503)
    res.send()
  }
})

export default router
