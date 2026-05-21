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
    dto.nameBook = overrides.nameBook ?? "C1";
    dto.name = overrides.name ?? "C1-morning";
    dto.scheduleDto = mockScheduleRequestDto(overrides.scheduleDto);
    dto.teacherName = overrides.teacherName ?? "Amelia Teacher";
    return dto;
}