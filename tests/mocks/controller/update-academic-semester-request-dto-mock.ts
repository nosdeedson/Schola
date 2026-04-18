import { UpdateAcademicSemesterRequestDto } from '../../../src/infrastructure/api/controllers/semester/dto/update/update-academic-semester-request-dto';

type UpdateAcademicSemesterRequestDtoMock = {
    id?: string;
    updatingQuarter?: boolean;
    updatingSemester?: boolean;
}

export function mockUpdateAcademicSemesterRequestDto(
    overrides: UpdateAcademicSemesterRequestDtoMock = {}
): UpdateAcademicSemesterRequestDto {
    const dto = new UpdateAcademicSemesterRequestDto();
    dto.id = overrides.id ?? "c5cfac9c-a3cb-4f29-bdfb-c49403539775";
    dto.updatingQuarter = overrides.updatingQuarter ?? true;
    dto.updatingSemester = overrides.updatingSemester ?? false;
    return dto;
}
