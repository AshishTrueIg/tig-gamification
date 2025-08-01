import db from "@src/db/models";
import { AppError } from "@src/errors/app.error";
import { Errors } from "@src/errors/errorCodes";
import { getUserBySegmentId } from "@src/helpers/getCrmUsers.helper";
import { BaseHandler } from "@src/libs/baseHandler";

export class CreateCamapaignHandler extends BaseHandler {
    async run() {
        const { name, isActive, templateId, segmentIds, status, daysOfWeek, time } = this.args;
        const transaction = this.context.sequelizeTransaction;

        const segments = await db.Segment.findAll({
            where: { id: segmentIds },
            transaction
        })

        if (segments.length !== segmentIds.length) {
            throw new AppError(Errors.INVALID_SEGMENT_ID);
        }


        const campaign = await db.Campaign.create({
            name,
            templateId,
            status,
            isActive,
            daysOfWeek: daysOfWeek ?? null,
            time: time ?? null,
        },
            { transaction }
        );

        await campaign.addSegments(segments, { transaction });

        return { campaign }
    }
}
