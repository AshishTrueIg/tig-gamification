import { CreateCampaignSchema } from '@src/json-schemas/campaign/createCampaign.schema'
import { deleteCampaignSchema } from '@src/json-schemas/campaign/deleteCampaign.schema'
import { getAllCampaignSchema } from '@src/json-schemas/campaign/getAllCampaign.schema'
import { getCampaignSchema } from '@src/json-schemas/campaign/getCampaign.schema'
import { updateCampaignStatusSchema } from '@src/json-schemas/campaign/updateCampaignStatus.schema'
import { UpdateCampaignSchema } from '@src/json-schemas/campaign/updateCampaign.schema'
import { getEmailTemplateSchema } from '@src/json-schemas/email/getEmailTemplate.schema'
import { getAllEmailTemplateSchema } from '@src/json-schemas/email/getAllEmailTemplate.schema'
import { updateEmailTemplateSchema } from '@src/json-schemas/email/updateEmailTemplate.schema'
import { createSegmentSchema } from '@src/json-schemas/segment/createSegment.schema'
import { deleteSegmentSchema } from '@src/json-schemas/segment/deleteSegment.schema'
import { getAllSegmentSchema } from '@src/json-schemas/segment/getAllSegment.schema'
import { updateSegmentSchema } from '@src/json-schemas/segment/updateSegment.schema'
import { CampaignController, EmailTemplateController, SegmentController } from '@src/rest-resources/controllers/crm.controller'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'
import express from 'express'
import { contextMiddleware } from '@src/rest-resources/middlewares/context.middleware'

const args = { mergeParams: true }
const crmRouter = express.Router(args)

crmRouter.route('/email/templates')
  .get(contextMiddleware(false),
    requestValidationMiddleware(getAllEmailTemplateSchema),
    EmailTemplateController.getAllEmailTemplate
  )

crmRouter.route('/sendgrid/templates').get(contextMiddleware(false), EmailTemplateController.updateSendGridEmailTemplate)

crmRouter.route('/email/template')
  .get(contextMiddleware(false),
    requestValidationMiddleware(getEmailTemplateSchema),
    EmailTemplateController.getEmailTemplateById
  )
  .put(contextMiddleware(true),
    requestValidationMiddleware(updateEmailTemplateSchema),
    EmailTemplateController.updateEmailTemplate
  )

//Campaign Routes
crmRouter.route('/campaign')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(getAllCampaignSchema),
    CampaignController.getAllCampaigns
  )
  .post(
    contextMiddleware(true),
    requestValidationMiddleware(CreateCampaignSchema),
    CampaignController.CreateCamapaign
  )
  .patch(
    contextMiddleware(true),
    requestValidationMiddleware(UpdateCampaignSchema),
    CampaignController.updateCampaign
  )
  .delete(
    contextMiddleware(true),
    requestValidationMiddleware(deleteCampaignSchema),
    CampaignController.deleteCampaign
  )

crmRouter.route('/campaign/details')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(getCampaignSchema),
    CampaignController.getCampaign
  )

crmRouter.route("/campaign/status")
  .patch(
    contextMiddleware(true),
    requestValidationMiddleware(updateCampaignStatusSchema),
    CampaignController.updateCampaignStatus
  );

//segment Routes
crmRouter.route('/segment')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(getAllSegmentSchema),
    SegmentController.getAllSegments
  )
  .post(
    contextMiddleware(true),
    requestValidationMiddleware(createSegmentSchema),
    SegmentController.CreateSegment
  )
  .delete(
    contextMiddleware(true),
    requestValidationMiddleware(deleteSegmentSchema),
    SegmentController.DeleteSegment
  )
  .patch(
    contextMiddleware(true),
    requestValidationMiddleware(updateSegmentSchema),
    SegmentController.UpdateSegment
  )

crmRouter.route('/segment/preview')
  .post(
    contextMiddleware(false), //passed false because we are performing get operation here only
    requestValidationMiddleware(createSegmentSchema),
    SegmentController.PreviewSegment
  )

crmRouter.route('/campaign/popup')
  .get(
    contextMiddleware(false),
    requestValidationMiddleware(getAllCampaignSchema),
    CampaignController.getAllPopupCampaigns
  )

export { crmRouter }
