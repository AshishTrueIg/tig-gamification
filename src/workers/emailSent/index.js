import { crmQueue, JOB_EMAIL_BATCHES, JOB_SEND_PROMO_EMAIL } from '@src/queues/crm.queue'
import path from 'path'

crmQueue.process(JOB_SEND_PROMO_EMAIL, 1, path.join(__dirname, './prepareEmailChucks.worker'))
crmQueue.process(JOB_EMAIL_BATCHES, 4, path.join(__dirname, './emailSent.worker'))
