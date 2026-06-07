import { QuarterEntity } from "../../entities/quarter/quarter.entity";
import { mockQuarter } from "../../../../tests/mocks/domain/quarter.mocks";
import { QuarterMapper } from "./quarter-mapper";
import { Quarter } from "../../../domain/quarter/quarter";

describe('QuarterMapper', () => {
    it('should convert to entity', () => {
        const domain = mockQuarter();
        expect(QuarterMapper.fromDomain(domain)).toBeInstanceOf(QuarterEntity);
    })

    it('should convert to domain', () => {
        const entity = QuarterMapper.fromDomain(mockQuarter());
        expect(QuarterMapper.fromEntity(entity)).toBeInstanceOf(Quarter);
    });

});
