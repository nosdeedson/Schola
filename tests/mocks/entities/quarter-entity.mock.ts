import { QuarterEntity } from "../../../src/infrastructure/entities/quarter/quarter.entity";
import { mockQuarter } from "../domain/quarter.mocks";

export function mockQuarterEntity(): QuarterEntity {
    const quarter = mockQuarter();
    const quarterEntity = new QuarterEntity();
    quarterEntity.beginningDate = quarter.beginningDate;
    quarterEntity.createdAt = new Date();
    quarterEntity.currentQuarter = true;
    quarterEntity.endingDate = quarter.endingDate;
    quarterEntity.id = quarter.getId();
    quarterEntity.quarterNumber = 1;
    return quarterEntity;
}
