import { CreateSchoolgroupRequestDto, ScheduleRequestDto } from '../../../src/infrastructure/api/controllers/schoolgroup/dto/create/create-schoolgroup-request-dto';

type ScheduleRequestDtoMock = {
    dayOfWeeks?: string[];
    times?: string[];
}

export function mockScheduleRequestDto(
    overrides: ScheduleRequestDtoMock = {}
): ScheduleRequestDto {
    const dto = new ScheduleRequestDto();
    dto.dayOfWeeks = overrides.dayOfWeeks ?? ['Monday', 'Tuesday'];
    dto.times = overrides.times ?? ['08:00', '09:00'];
    return dto;
}