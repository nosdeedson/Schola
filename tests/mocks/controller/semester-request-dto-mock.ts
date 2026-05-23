import { SemesterRequestDto } from "@/infrastructure/api/controllers/semester/dto/create/semester-request-dto";
import { mockQuarterRequestDto } from "./quarter-request-dto-mock";

export function mockSemesterRequestDto(
    overrides: Partial<SemesterRequestDto> = {}
): SemesterRequestDto {
    let dto = new SemesterRequestDto();
    dto.currentSemester = overrides.currentSemester || false;
    dto.firstQuarter = overrides.firstQuarter || mockQuarterRequestDto();
    dto.secondQuarter = overrides.secondQuarter || mockQuarterRequestDto();
    return dto;
}
