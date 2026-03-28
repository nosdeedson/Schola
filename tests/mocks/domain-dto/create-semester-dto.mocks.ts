import { QuarterDto } from "../../../src/application/services/academic-semester/create/quarter/quarter.dto";
import { CreateAcademicSemesterDto } from "../../../src/application/services/academic-semester/create/semester/academic-semester.dto";
import { mockQuarterDto } from "./quarter-dto.mocks";


type CreateSemesterDtoMock = {
    firstQuarter?: QuarterDto,
    secondQuarter?: QuarterDto,
    currentSemester?: boolean
}

export function mockCreateSemesterDto(
    overrides: CreateSemesterDtoMock = {}
): CreateAcademicSemesterDto {
    return new CreateAcademicSemesterDto({
        firstQuarter: overrides.firstQuarter ?? mockQuarterDto(),
        secondQuarter: overrides.secondQuarter ?? mockQuarterDto(),
        currentSemester: overrides.currentSemester ?? true
    });
}