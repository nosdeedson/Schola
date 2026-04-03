import { CreateSchoolgroupScheduleUsecaseDto } from '../../../src/application/usecases/schoolgroup-usecases/create/dto/create-schoolgroup-schedule-usecase.dto';

type CreateSchoolgroupScheduleUsecaseDtoMock = {
    dayOfWeeks?: string[],
    times?: string[]
}

export function mockCreateSchoolgroupScheduleUsecaseDto(
    overrides: CreateSchoolgroupScheduleUsecaseDtoMock = {}
) : CreateSchoolgroupScheduleUsecaseDto {
    return new CreateSchoolgroupScheduleUsecaseDto({
        dayOfWeeks : overrides.dayOfWeeks ?? ['Monday', 'Tuesday'],
        times: overrides.times ?? ['08:00', '09:00']
    })
}