import { AddSendPromoEmailJobHandler } from "@src/services/email/addSendPromoEmailJob.handler"
import { ApiHelper } from "@src/utils/api.utils"

export default class JobController {
  static async addSendPromoEmailJob(req, res, next) {
    try {
      const data = await AddSendPromoEmailJobHandler.execute({ ...req.body })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}
