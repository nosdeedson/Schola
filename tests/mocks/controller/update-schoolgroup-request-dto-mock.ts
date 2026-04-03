import { UpdateSchoolgroupRequestDto } from '../../../src/infrastructure/api/controllers/schoolgroup/dto/update/update-schoolgroup-request-dto';

type UpdateSchoolgroupRequestDtoMock = {
    id?: string,
    nameBook?: string,
    teacherName?: string,
}

export function mockUpdateSchoolgroupRequestDto(
    overrides: UpdateSchoolgroupRequestDtoMock = {}
): UpdateSchoolgroupRequestDto {
    const dto = new UpdateSchoolgroupRequestDto();
    dto.id = overrides.id ?? "123";
    dto.nameBook = overrides.nameBook ?? "name book";
    dto.teacherName = overrides.teacherName ?? "teacher name";
    return dto;
}