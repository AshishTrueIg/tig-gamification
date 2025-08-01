import db from '@src/db/models'
import ajv from '@src/libs/ajv'
import { ERROR_MSG } from '@src/utils/errors'
import { BaseHandler } from '@src/libs/baseHandler'

import { updateEntity } from '@src/services/helper/crud'
import { deleteImage, getKey, removeByAttr, removeLogo } from '@src/utils/common'
import { deleteFileFromS3 } from '@src/utils/s3.utils'

const schema = {
  type: 'object',
  properties: {
    imageUrl: { type: 'string' }
  },
  required: ['imageUrl']
}

export class DeleteImageFromGalleryHandler extends BaseHandler {
  async run () {
    const { imageUrl } = this.args // imageUrl = key of image
    const transaction = this.context.sequelizeTransaction
    const message = ERROR_MSG.IMAGE_ERROR
    const success = false

    const gallery = ((await db.GlobalSetting.findOne({
      attributes: ['key', 'value'],
      where: { key: 'ADMIN_GALLERY' },
      raw: true,
      transaction
    })).value)

    // await removeLogo(getKey(imageUrl))
    // await deleteImage(imageUrl)
    await deleteFileFromS3(imageUrl)
    const newGallery = removeByAttr(gallery, 'fileName', getKey(imageUrl))

    await updateEntity({
      model: db.GlobalSetting,
      values: { key: 'ADMIN_GALLERY' },
      data: { value: newGallery },
      transaction
    })

    return { success: true }
  }
}
