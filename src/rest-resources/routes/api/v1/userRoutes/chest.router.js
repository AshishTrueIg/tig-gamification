import express from 'express'

const chestRouter = express.Router()

chestRouter.use('/abc', chestRouter)

export default chestRouter
