import { CreateCamapaignHandler } from '@src/handlers/crm/campaign/createCampaigns.handler'
import { DeleteCampaignHandler } from '@src/handlers/crm/campaign/deleteCampaign.handler'
import { GetAllCampaignsHandler } from '@src/handlers/crm/campaign/getAllCampaigns.handler'
import { GetAllPopupCampaignsHandler } from '@src/handlers/crm/campaign/getAllPopupCampaign.handler'
import { GetCampaignHandler } from '@src/handlers/crm/campaign/getCampaign.handler'
import { GetEmailEventsHandler } from '@src/handlers/crm/campaign/getEmailEvents.handler'
import { UpdateCampaignHandler } from '@src/handlers/crm/campaign/updateCampaign.handler'
import { UpdateCampaignStatusHandler } from '@src/handlers/crm/campaign/updateCampaignStatus.handler'
import { GetAllEmailTemplateHandler } from '@src/handlers/crm/emailTemplates/getAllTemplates.handler'
import { GetEmailTemplateHandler } from '@src/handlers/crm/emailTemplates/getTemplateById.handler'
import { UpdateEmailTemplateHandler } from '@src/handlers/crm/emailTemplates/updateEmailTemplate.handler'
import { CreateSegmentHandler } from '@src/handlers/crm/segment/createSegments.handler'
import { DeleteSegmentHandler } from '@src/handlers/crm/segment/deleteSegment.handler'
import { GetAllSegmentsHandler } from '@src/handlers/crm/segment/getAllSegments.handler'
import { PreviewSegmentHandler } from '@src/handlers/crm/segment/previewSegment.handler'
import { UpdateSegmentHandler } from '@src/handlers/crm/segment/updateSegment.handler'
import { UpdateSendGridEmailTemplateHandler } from '@src/handlers/sendGrid/updateEmailTemplate.handler'
import { ApiHelper } from '@src/utils/api.utils'

export class EmailTemplateController {
  static async getAllEmailTemplate (req, res, next) {
    try {
      const data = await GetAllEmailTemplateHandler.execute({ ...req.body, ...req.query })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async updateSendGridEmailTemplate (req, res, next) {
    try {
      const data = await UpdateSendGridEmailTemplateHandler.execute({ ...req.body, ...req.query }, req.context)
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getEmailTemplateById (req, res, next) {
    try {
      const data = await GetEmailTemplateHandler.execute({ ...req.body, ...req.query })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async updateEmailTemplate (req, res, next) {
    try {
      const data = await UpdateEmailTemplateHandler.execute(req.body, req.context)
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}

export class CampaignController {
  static async getAllCampaigns (req, res, next) {
    try {
      const data = await GetAllCampaignsHandler.execute({ ...req.query, ...req.body })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async CreateCamapaign (req, res, next) {
    try {
      const data = await CreateCamapaignHandler.execute({ ...req.body }, req.context)
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async updateCampaign (req, res, next) {
    try {
      const data = await UpdateCampaignHandler.execute({ ...req.body }, req.context)
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getCampaign (req, res, next) {
    try {
      const data = await GetCampaignHandler.execute({ ...req.query, ...req.body })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async deleteCampaign (req, res, next) {
    try {
      const data = await DeleteCampaignHandler.execute({ ...req.query, ...req.body })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async updateCampaignStatus (req, res, next) {
    try {
      const data = await UpdateCampaignStatusHandler.execute({ ...req.body }, req.context)
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getEmailEvents (req, res, next) {
    try {
      const data = await GetEmailEventsHandler.execute({ ...req.query, ...req.body })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async getAllPopupCampaigns (req, res, next) {
    try {
      const data = await GetAllPopupCampaignsHandler.execute({ ...req.query, ...req.body })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}

export class SegmentController {
  static async getAllSegments (req, res, next) {
    try {
      const data = await GetAllSegmentsHandler.execute({ ...req.query, ...req.body })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async CreateSegment (req, res, next) {
    try {
      const data = await CreateSegmentHandler.execute({ ...req.body }, req.context)
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async DeleteSegment (req, res, next) {
    try {
      const data = await DeleteSegmentHandler.execute({ ...req.body }, req.context)
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async UpdateSegment (req, res, next) {
    try {
      const data = await UpdateSegmentHandler.execute({ ...req.body }, req.context)
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }

  static async PreviewSegment (req, res, next) {
    try {
      const data = await PreviewSegmentHandler.execute({ ...req.query, ...req.body })
      ApiHelper.sendResponse({ req, res, next }, data)
    } catch (error) {
      next(error)
    }
  }
}
