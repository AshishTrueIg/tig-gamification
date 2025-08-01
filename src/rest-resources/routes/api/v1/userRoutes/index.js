import express from 'express'
import chestRouter from './chest.router'

const userRouter = express.Router()

userRouter.use('/chest', chestRouter)

export default userRouter
