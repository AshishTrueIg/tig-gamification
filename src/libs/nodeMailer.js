import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'
import config from '../configs/app.config'
import { VENDORS } from '../libs/constants'

const sendGridAuth = {
  host: config.get('sendgrid.domain'),
  port: config.get('sendgrid.port'),
  auth: {
    user: 'apikey',
    pass: config.get('sendgrid.apiKey')
  }
}

const mailGunAuth = {
  auth: {
    api_key: config.get('mailgun.apiKey'),
    domain: config.get('mailgun.domain')
  }
}

const nodeMailer = config.get('vendor.type') === VENDORS.MAILGUN ? nodemailer.createTransport(mg(mailGunAuth)) : nodemailer.createTransport(sendGridAuth)

export default nodeMailer
