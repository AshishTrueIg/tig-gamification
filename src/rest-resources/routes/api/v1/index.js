import express from 'express'
import demoRoutes from './demo.routes'
import adminRouter from './adminRoutes'
import userRouter from './userRoutes'

const v1Router = express.Router()

v1Router.use('/demo', demoRoutes)
v1Router.use('/admin', adminRouter)
v1Router.use('/user', userRouter)

export default v1Router
