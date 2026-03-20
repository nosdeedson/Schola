import { mockQuarterDto } from "../../../../../../tests/mocks/dto/quarter-dto.mocks";
import { Quarter } from "../../../../../domain/quarter/quarter";

describe('quarterDto', () => {

    it('should create a Domain Quarter', () => {
        const firstQuarterDto = mockQuarterDto();
        const domainQuarter = firstQuarterDto.toDomain();
        expect(domainQuarter).toBeInstanceOf(Quarter);
        expect(domainQuarter.beginningDate.getTime()).toBe(firstQuarterDto.beginningDate.getTime());
        expect(domainQuarter.endingDate.getTime()).toBe(firstQuarterDto.endingDate.getTime());
        expect(domainQuarter.currentQuarter).toBeFalsy();
    });
});