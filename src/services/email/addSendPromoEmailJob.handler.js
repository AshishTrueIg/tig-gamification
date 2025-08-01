import { crmQueue, JOB_SEND_PROMO_EMAIL } from '@src/queues/crm.queue'
import { DAYS_OF_WEEK } from '@src/utils/constants/crm.constants'
import { Logger } from '@src/libs/logger'
import { BaseHandler } from '@src/libs/baseHandler'


export class AddSendPromoEmailJobHandler extends BaseHandler {
  async run() {
    const { emailTemplateId, segmentId, campaignId, daysOfWeek, time, status } = this.args

    try {
     const jobId = `promo_email_${emailTemplateId}`
      
      if (status === "stopped") {
        if (daysOfWeek && daysOfWeek.length > 0 && time) {
          const [hour, minute] = time.split(':').map(Number)
          const dayToCronMap = this.getDayToCronMap()
          
          for (const day of daysOfWeek) {
            const cronDay = dayToCronMap[day.toLowerCase()]
            if (cronDay === undefined) continue
            
            const cron = `${minute} ${hour} * * ${cronDay}`
            await crmQueue.removeRepeatable(JOB_SEND_PROMO_EMAIL, { cron, jobId })
          }
        }
        
        const activeJobs = await crmQueue.getJobs(['active', 'waiting', 'delayed'])
        for (const job of activeJobs) {
          if (job.data && job.data.jobId === jobId) {
            await job.remove()
          }
        }
        
        Logger.info(`All jobs for email template ${emailTemplateId} have been removed`)
        return {
          message: `All jobs for email template ${emailTemplateId} have been removed`,
          success: true
        }
      }
      
      if (daysOfWeek && daysOfWeek.length > 0 && time) {
        const [hour, minute] = time.split(':').map(Number)
        const dayToCronMap = this.getDayToCronMap()
        
        for (const day of daysOfWeek) {
          const cronDay = dayToCronMap[day.toLowerCase()]
          if (cronDay === undefined) continue
          
          const cron = `${minute} ${hour} * * ${cronDay}`
          
          await crmQueue.removeRepeatable(JOB_SEND_PROMO_EMAIL, { cron, jobId })
          
          await crmQueue.add(
            JOB_SEND_PROMO_EMAIL,
            { emailTemplateId, segmentId, campaignId, jobId },
            {
              jobId,
              repeat: { cron }
            }
          )
        }
        
        Logger.info('Scheduled repeatable promo email jobs added to the queue!')
      } else {
        await crmQueue.add(
          JOB_SEND_PROMO_EMAIL,
          { emailTemplateId, segmentId, campaignId }
        )
        
        Logger.info('One-time promo email job added to the queue!')
      }
      
      return {
        message: 'Promo email jobs processed successfully',
        success: true
      }
    } catch (error) {
      Logger.error(error, 'Error processing promo email job:')
      return {
        message: 'Error processing promo email job',
        error
      }
    }
  }
  
  getDayToCronMap() {
    return {
      [DAYS_OF_WEEK.SUNDAY.toLowerCase()]: 0,
      [DAYS_OF_WEEK.MONDAY.toLowerCase()]: 1,
      [DAYS_OF_WEEK.TUESDAY.toLowerCase()]: 2,
      [DAYS_OF_WEEK.WEDNESDAY.toLowerCase()]: 3,
      [DAYS_OF_WEEK.THURSDAY.toLowerCase()]: 4,
      [DAYS_OF_WEEK.FRIDAY.toLowerCase()]: 5,
      [DAYS_OF_WEEK.SATURDAY.toLowerCase()]: 6
    }
  }
}