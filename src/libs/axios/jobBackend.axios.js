import config from '@src/configs/app.config'
import axios from 'axios'
import { Logger } from '../logger'

export class JobBackendAxios {
  static getAxiosInstance() {
    return axios.create({
      baseURL: 'https://api.sendgrid.com/v3',
      headers: {
        'Authorization': `Bearer ${config.get('sendGrid.apiKey')}`,
        'Content-Type': 'application/json'
      },
    })
  }

  static async createList(name) {
    try {
      const axiosInstance = this.getAxiosInstance()

      // Create new list
      const payload = { name }

      const createListRes = await axiosInstance.post('/marketing/lists', payload)

      const listId = createListRes.data?.id
      if (!listId) {
        throw new Error('No list ID returned from create list response')
      }

      return listId

    } catch (error) {
      throw error
    }
  }

  static async uploadContacts(contacts, listIds = []) {
    try {
      const axiosInstance = this.getAxiosInstance()

      const payload = {
        list_ids: listIds,
        contacts
      }

      const response = await axiosInstance.put('/marketing/contacts', payload)
      return response.data
    } catch (error) {
      console.log(JSON.stringify(error), "=============")
      throw error
    }
  }

  static async createCampaign({ name, senderId, templateId, listIds, templatedesignName }) {
    try {
      const axiosInstance = this.getAxiosInstance()

      const templateResponse = await axiosInstance.get(`/templates/${templateId}`)

      if (!templateResponse.data || !templateResponse.data.versions || templateResponse.data.versions.length === 0) {
        throw new Error('No template versions found for template ID: ' + templateId)
      }

      // Get the active version or the first version
      const activeVersion = templateResponse.data.versions.find(v => v.active === 1) || templateResponse.data.versions[0]

      if (!activeVersion.html_content) {
        throw new Error('Template has no HTML content')
      }

      //check if the design is already created and available
      const existingDesignsRes = await axiosInstance.get('/designs')
      const designName = `${templatedesignName}-Design`
      const existingDesign = existingDesignsRes.data.result.find(d => d.name === designName)

      let designId
      if (existingDesign) {

        const designDetailRes = await axiosInstance.get(`/designs/${existingDesign.id}`)
        const existingHtml = designDetailRes.data?.html_content || ''

        designId = existingDesign.id

        if (existingHtml.trim() !== activeVersion.html_content.trim()) {
          const updatePayload = {
            html_content: activeVersion.html_content,
            plain_content: activeVersion.plain_content || 'Plain text version of your email.',
            subject: activeVersion.subject || name
          }

          const updateResponse = await axiosInstance.patch(`/designs/${existingDesign.id}`, updatePayload)

          if (!updateResponse.data?.id) {
            throw new Error('Design ID not returned from SendGrid design creation after content change')
          }

          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }


      else {
        // Create a new design using the actual template content
        const designPayload = {
          name: `${designName}`,
          html_content: activeVersion.html_content,
          plain_content: activeVersion.plain_content || 'Plain text version of your email.',
          subject: activeVersion.subject || name
        }

        const designResponse = await axiosInstance.post('/designs', designPayload)

        designId = designResponse.data?.id

        if (!designId) {
          throw new Error('Design ID not returned from SendGrid design creation')
        }

        // Wait a moment for the design to be fully processed
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Now create the campaign using the design ID
      const campaignPayload = {
        name,
        send_to: {
          list_ids: listIds
        },
        email_config: {
          sender_id: parseInt(senderId),
          design_id: designId,
          generate_plain_content: true,
          editor: 'design',
          suppression_group_id: 28507
        }
      }

      const campaignResponse = await axiosInstance.post('/marketing/singlesends', campaignPayload)
      return campaignResponse.data?.id
    } catch (error) {
      throw error
    }
  }

  static async getSenderIdByEmail(senderEmail) {
    try {
      const axiosInstance = this.getAxiosInstance()
      const { data } = await axiosInstance.get('/marketing/senders')

      const senders = Array.isArray(data?.result) ? data.result : Array.isArray(data) ? data : []
      const sender = senders.find(s => s.from?.email === senderEmail || s.email === senderEmail)

      if (!sender) throw new Error(`No verified sender found for ${senderEmail}`)
      return sender.id
    } catch (error) {
      Logger.error("Failed to fetch sender ID by email", error)
      throw error
    }
  }




  static async scheduleCampaign(campaign_id) {
    try {
      const axiosInstance = this.getAxiosInstance()


      const campaignResponse = await axiosInstance.get(`/marketing/singlesends/${campaign_id}`)
      const campaign = campaignResponse.data

      if (!campaign.send_to || !campaign.send_to.list_ids || campaign.send_to.list_ids.length === 0) {
        throw new Error('Campaign must have recipient lists configured')
      }

      if (!campaign.email_config || !campaign.email_config.subject || !campaign.email_config.html_content) {
        throw new Error('Campaign must have subject and content configured')
      }

      // Only proceed if campaign is in draft status
      if (campaign.status !== 'draft') {
        throw new Error(`Campaign must be in 'draft' status to schedule. Current status: ${campaign.status}`)
      }

      // Calculate send time - at least 10 minutes from now (SendGrid requirement)
      const now = new Date()
      const sendTime = new Date(now.getTime() + (10 * 60 * 1000)) // 10 minutes from now
      const sendAt = sendTime.toISOString()

      const payload = {
        send_at: sendAt
      }

      // Schedule the campaign
      const response = await axiosInstance.put(`/marketing/singlesends/${campaign_id}/schedule`, payload)

      // Verify the campaign was scheduled
      const updatedCampaign = await axiosInstance.get(`/marketing/singlesends/${campaign_id}`)

      return { success: true }

    } catch (error) {
      throw error
    }
  }

  static async deleteAllDesigns() {
    const axiosInstance = this.getAxiosInstance();

    try {

      // Step 1: Fetch all designs
      const { data } = await axiosInstance.get('/designs');

      const designs = Array.isArray(data?.result) ? data.result : [];

      if (!designs.length) {
        return;
      }


      const results = await Promise.allSettled(
        designs.map(({ id }) => axiosInstance.delete(`/designs/${id}`))
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const failed = results
        .map((r, i) => ({ result: r, design: designs[i] }))
        .filter(({ result }) => result.status === 'rejected');

      if (failed.length > 0) {
        Logger.warn(`Failed: ${failed.length}`);
        failed.forEach(({ design, result }) => {
          Logger.warn(`• ${design.name} (${design.id})`);
          Logger.warn(result.result.reason?.response?.data || result.result.reason?.message);
        });
      }
    } catch (err) {
      throw err;
    }
  }


}