import { CreateSchoolgroupRequestDto, ScheduleRequestDto } from "../../../src/infrastructure/api/controllers/schoolgroup/dto/create/create-schoolgroup-request-dto";
import { mockScheduleRequestDto } from "./schedule-request-dto-mock";

type CreateSchoolgroupRequestDtoMock = {
    name?: string;
    nameBook?: string;
    scheduleDto?: ScheduleRequestDto;
    teacherName?: string;
}

export function mockCreateSchoolgroupRequestDto(
    overrides: CreateSchoolgroupRequestDtoMock = {}
): CreateSchoolgroupRequestDto {
    const dto = new CreateSchoolgroupRequestDto();
    dto.name = overrides.name ?? "class name";
    dto.nameBook = overrides.nameBook ?? "book name";
    dto.scheduleDto = overrides.scheduleDto ?? mockScheduleRequestDto();
    dto.teacherName = overrides.teacherName ?? "teacher name";
    return dto;
}