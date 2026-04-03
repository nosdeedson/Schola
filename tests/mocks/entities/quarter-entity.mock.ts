import { QuarterEntity } from "../../../@/infrastructure/entities/quarter/quarter.entity";
import { mockQuarter } from "../domains/quarter.mocks";

export function mockQuarterEntity(){
    const quarter = mockQuarter();
    const quarterEntity = new QuarterEntity();
    quarterEntity.beginningDate = quarter.beginningDate;
    quarterEntity.createdAt = new Date();
    quarterEntity.currentQuarter = true;
    quarterEntity.endingDate = quarter.endingDate;
    quarterEntity.id = quarter.getId();
    quarterEntity.quarterNumber = 1;
}