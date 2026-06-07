import { Quarter } from "@/domain/quarter/quarter";
import { QuarterEntity } from "../../entities/quarter/quarter.entity";

export class QuarterMapper {

    static fromDomain(quarter: Quarter, quarterNumber?: number): QuarterEntity {
        let entity = new QuarterEntity();
        entity.id = quarter.getId();
        entity.quarterNumber = quarterNumber ? quarterNumber : entity.quarterNumber;
        entity.beginningDate = quarter.beginningDate;
        entity.endingDate = quarter.endingDate;
        entity.currentQuarter = quarter.currentQuarter;
        return entity;
    }

    static fromEntity(entity: QuarterEntity): Quarter {
        return new Quarter({
            currentQuarter: entity.currentQuarter,
            beginningDate: entity.beginningDate,
            endingDate: entity.endingDate,
            id: entity?.id,
            createdAt: entity?.createdAt,
            deletedAt: entity?.deletedAt,
            updatedAt: entity?.updatedAt
        })
    }
}
