import { QuarterRequestDto } from "../../../src/infrastructure/api/controllers/semester/dto/quarter-request-dto";


export function mockQuarterRequestDto(
    overrides: Partial<QuarterRequestDto> = {}
): QuarterRequestDto{
    let dto =  new QuarterRequestDto();
    dto.beginningDate = overrides.beginningDate || new Date(2026, 0, 1);
    dto.endingDate = overrides.endingDate || new Date(2026, 2, 31);
    dto.currentQuarter = overrides.currentQuarter || false;
    return dto;
}