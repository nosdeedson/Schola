import { SemesterRequestDto } from "@/infrastructure/api/controllers/semester/dto/semester-request-dto";
import { mockQuarterRequestDto } from "./quarter-request-dto";

export function mockSemesterRequestDto(
    overrides: Partial<SemesterRequestDto> = {}
): SemesterRequestDto {
    const dto = new SemesterRequestDto();
    dto.currentSemester = overrides.currentSemester || false;
    dto.firstQuarter = overrides.firstQuarter || mockQuarterRequestDto();
    dto.secondQuarter = overrides.secondQuarter || mockQuarterRequestDto();
    return dto;
}
