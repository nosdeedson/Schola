import { AccessType } from '../../../src/domain/user/access.type';
import { CreateUserRequestDto } from '../../../src/infrastructure/api/controllers/users/dtos/create-user-dto/create-user-request-dto';

type CreateUserRequestDtoMock = {
    name?: string;
    birthDate?: string;
    email?: string;
    password?: string;
    accessType?: AccessType;
    classCode?: string;
    nickname?: string;
    parents?: string[];
    students?: string[];
}

export function mockCreateUserRequestDto(
    overrides: CreateUserRequestDtoMock = {}
): CreateUserRequestDto {
    const dto = new CreateUserRequestDto();
    dto.accessType = overrides.accessType ?? AccessType.ADMIN;
    dto.birthDate = overrides.birthDate ?? new Date().toISOString();
    dto.classCode = overrides.classCode ?? "1234";
    dto.email = overrides.email ?? "email@email";
    dto.name = overrides.name ?? "name user";
    dto.nickname = overrides.nickname ?? "nickname";
    dto.parents = overrides.parents ?? ['father', 'mother'];
    dto.password = overrides.password ?? '1234';
    dto.students = overrides.students ?? ['student 1', 'student 2'];
    return dto;
}
