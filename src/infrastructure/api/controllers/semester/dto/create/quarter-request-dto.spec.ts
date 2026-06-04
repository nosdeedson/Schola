import { QuarterRequestDto } from "./quarter-request-dto";

describe('QuarterRequestDto', () => {
    it('should instantiate a QuarterRequestDto', () => {
        const dto = new QuarterRequestDto();
        dto.beginningDate = "2026-02-02T00:16:52.483Z"
        dto.currentQuarter = true;
        dto.endingDate = "2026-04-15T23:16:52.483Z";
        expect(dto).toBeDefined();
        expect(dto.beginningDate).toBe("2026-02-02T00:16:52.483Z");
        expect(dto.endingDate).toBe("2026-04-15T23:16:52.483Z");
        expect(dto.currentQuarter).toBeTruthy();
    });
});