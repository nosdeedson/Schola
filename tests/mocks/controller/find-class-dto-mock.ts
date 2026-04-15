import { FindClassDto, FindClassScheduleDto, FindClassStudentDto, FindClassTeacherDto } from "../../../src/application/services/class/find/find.class.dto";


type FindClassDtoMock = {
    id?: string;
    classCode?: string;
    nameBook?: string;
    name?: string;
    schedule?: FindClassScheduleDtoMock;
    teacher?: FindClassTeacherDtoMock;
    students?: FindClassStudentDtoMock[];

}

type FindClassScheduleDtoMock = {
    dayOfWeeks?: string[];
    times?: Record<string, string>;
}

type FindClassTeacherDtoMock = {
    id?: string;
    name?: string;
}

type FindClassStudentDtoMock = {
    id?: string;
    name?: string;
}

export function mockFindClassDto(
    overrides: FindClassDtoMock = {}
): FindClassDto{
    const dto = new FindClassDto();
    dto.id = overrides.id ?? "440b6b48-7cdc-49a3-bf6f-06fdf700a757",
    dto.classCode = overrides.classCode ?? '123',
    dto.name = overrides.name ?? "class name",
    dto.nameBook = overrides.nameBook ?? 'name book',
    dto.schedule = mockFindClassScheduleDto(overrides.schedule) ?? mockFindClassScheduleDto(),
    dto.students = mockFindClassStudentDto(overrides.students) ?? mockFindClassStudentDto(),
    dto.teacher = mockFindClassTeacherDto(overrides.teacher) ?? mockFindClassTeacherDto()
    return dto;
}

export function mockFindClassScheduleDto(
    overrides: FindClassScheduleDtoMock = {}
): FindClassScheduleDto{
    const dto = new FindClassScheduleDto();
    dto.dayOfWeeks = overrides.dayOfWeeks ?? ['monday', 'tuesday'],
    dto.times = overrides.times ?? {'monday': '08:00', 'tuesday': '08:00'}
    return dto;
}

export function mockFindClassTeacherDto(
    overrides: FindClassTeacherDtoMock = {}
): FindClassTeacherDto{
    const dto = new FindClassTeacherDto();
    dto.id = overrides.id ?? 'd9a5cbe7-90a3-4b5c-a495-af61d61af4a5',
    dto.name = overrides.name ?? "name student"
    return dto;
}

export function mockFindClassStudentDto(
    overrides: FindClassStudentDtoMock[] = []
): FindClassStudentDto[]{
    const dto = new FindClassStudentDto();
    dto.id = overrides[0]?.id ?? '7e2563cd-628c-475a-adaf-4e43d2e5602e',
    dto.name = overrides[0]?.name ?? "name student"
    return [dto];
}