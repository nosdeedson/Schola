import { QuarterRequestDto } from "@/infrastructure/api/controllers/semester/dto/create/quarter-request-dto";


export function mockQuarterRequestDto(
    overrides: Partial<QuarterRequestDto> = {}
): QuarterRequestDto {
    let dto = new QuarterRequestDto();
    dto.beginningDate = overrides.beginningDate || "2026-02-02T00:16:52.483Z";
    dto.endingDate = overrides.endingDate || "2026-04-15T00:16:52.483Z";
    dto.currentQuarter = overrides.currentQuarter || false;
    return dto;
}
