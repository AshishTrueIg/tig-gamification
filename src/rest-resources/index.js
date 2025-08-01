import config from '@src/configs/app.config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import routes from '../rest-resources/routes'
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware'

const app = express()

// Security headers
app.use(helmet())

// Logging
app.use(morgan('tiny'))

// Parsing request bodies
app.use(express.json()) // Built-in JSON body parser
app.use(express.urlencoded({ extended: true })) // Built-in URL-encoded parser

app.use(
  cors({
    origin: config.get('app.origin').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  })
)

app.use(routes)

app.use(async (req, res) => {
  res.status(404).json({ status: 'Not Found' })
})

app.use(errorHandlerMiddleware)

export default app
