import { QuarterDto } from "../../../src/application/services/academic-semester/create/quarter/quarter.dto";
import { CreateAcademicSemesterUsecaseDto } from "../../../src/application/services/academic-semester/create/semester/create-academic-semester-usecase.dto";
import { mockQuarterDto } from "./quarter-dto.mocks";


type CreateSemesterDtoMock = {
    firstQuarter?: QuarterDto,
    secondQuarter?: QuarterDto,
    currentSemester?: boolean
}

export function mockCreateSemesterDto(
    overrides: CreateSemesterDtoMock = {}
): CreateAcademicSemesterUsecaseDto {
    return new CreateAcademicSemesterUsecaseDto({
        firstQuarter: overrides.firstQuarter ?? mockQuarterDto(),
        secondQuarter: overrides.secondQuarter ?? mockQuarterDto(),
        currentSemester: overrides.currentSemester ?? true
    });
}