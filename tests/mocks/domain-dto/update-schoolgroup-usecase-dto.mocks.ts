import { UpdateSchoolgroupUsecaseDto } from '../../../src/application/usecases/schoolgroup-usecases/update/update-schoolgroup-usecase.dto';

type UpdateSchoolgroupUsecaseDtoMock = {
    id?: string;
    nameBook?: string;
    teacherName?: string;
}

export function mockUpdateSchoolgroupUsecaseDto(
    overrides: UpdateSchoolgroupUsecaseDtoMock = {}
): UpdateSchoolgroupUsecaseDto {
    const dto = new UpdateSchoolgroupUsecaseDto();
    dto.id = overrides.id ?? 'b64fd367-4f26-4eb2-b0c7-64ffcb506305';
    dto.nameBook = overrides.nameBook ?? "name book";
    dto.teacherName = overrides.teacherName ?? "teacher name";
    return dto;
}