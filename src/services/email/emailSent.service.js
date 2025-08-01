import config from "@src/configs/app.config"
import { JobBackendAxios } from "@src/libs/axios/jobBackend.axios"
import { Logger } from "@src/libs/logger"
import { BaseHandler } from "@src/libs/logicBase"

export class EmailSentService extends BaseHandler {
    async run() {
        try {
            const { users, templateProviderId, batchNumber, campaignId } = this.args
            const contacts = this.prepareContacts(users)
            const listName = this.generateListName(campaignId, batchNumber)

            const listId = await this.createContactList(listName)
            await this.uploadContacts(contacts, listId)

            const senderEmail = config.get('sendGrid.senderEmail')
            const senderId = await JobBackendAxios.getSenderIdByEmail(senderEmail)
            const newCampaignId = await this.createAndScheduleCampaign({
                listName,
                listId,
                senderId,
                templateId: templateProviderId,
                campaignId,
                batchNumber
            })

            return {
                success: true,
                listId,
                campaignId: newCampaignId,
                contactCount: contacts.length
            }
        } catch (error) {
            Logger.error('EmailSentService failed:', error)
            throw error
        }
    }

    prepareContacts(users) {
        return users.map(user => ({
            email: user.email,
            custom_fields: {
                name: user.username || ''
            },
        }))
    }

    generateListName(campaignId, batchNumber) {
        return `Campaign-${campaignId}-Batch-${batchNumber}-${Date.now()}`
    }

    async createContactList(name) {
        try {
            const listId = await JobBackendAxios.createList(name)
            if (!listId) throw new Error("List creation returned falsy ID")
            return listId
        } catch (error) {
            Logger.error("Failed to create contact list", error)
            throw error
        }
    }

    async uploadContacts(contacts, listId) {
        try {
            const uploaded = await JobBackendAxios.uploadContacts(contacts, [listId])
            if (!uploaded) throw new Error("Contacts upload returned falsy response")
        } catch (error) {
            Logger.error("Failed to upload contacts", error)
            throw error
        }
    }

    async createAndScheduleCampaign({ listName, listId, senderId, templateId, campaignId, batchNumber }) {
        try {
            const newCampaignId = await JobBackendAxios.createCampaign({
                name: `${listName}-Campaign`,
                senderId,
                templateId,
                listIds: [listId],
                templatedesignName: `Campaign-${campaignId}-Batch-${batchNumber}`
            })

            if (!newCampaignId) throw new Error("Campaign creation failed")

            const scheduled = await JobBackendAxios.scheduleCampaign(newCampaignId)
            if (!scheduled) throw new Error("Campaign scheduling failed")

            return newCampaignId
        } catch (error) {
            Logger.error("Failed to create and schedule campaign", error)
            throw error
        }
    }
}
