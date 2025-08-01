import express from 'express'
import { crmRouter } from './crm.router'

const adminRouter = express.Router()

adminRouter.use('/crm', crmRouter)

export default adminRouter
