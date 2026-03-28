import { UpdateAcademicSemesterDto } from "../../../src/application/services/academic-semester/update/udpate.academic-semester.dto";

type UpdateSemesterDtoMock = {
    id?: string;
    updatingQuarter?: boolean;
    updatingSemester?: boolean;
}

export function mockUpdateSemesterDto(
    overrides: UpdateSemesterDtoMock = {}
) : UpdateAcademicSemesterDto{
    return new UpdateAcademicSemesterDto({
        id: overrides.id ?? "123",
        updatingQuarter: overrides.updatingQuarter ?? true,
        updatingSemester: overrides.updatingSemester ?? false,
    });
}