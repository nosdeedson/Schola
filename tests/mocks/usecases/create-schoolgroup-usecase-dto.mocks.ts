import { CreateSchoolgroupScheduleUsecaseDto } from '../../../src/application/usecases/schoolgroup-usecases/create/dto/create-schoolgroup-schedule-usecase.dto';
import { CreateSchoolgroupUseCaseDto } from '../../../src/application/usecases/schoolgroup-usecases/create/dto/create-schoolgroup-usecase.dto';
import { mockCreateSchoolgroupScheduleUsecaseDto } from './create-schoolgroup-schedule-usecase-dto.mocks';


type CreateSchoolgroupUseCaseDtoMock = {
    name?: string;
    nameBook?: string;
    scheduleDto?: CreateSchoolgroupScheduleUsecaseDto;
    teacherName?: string;
}

export function mockCreateSchoolgroupUseCaseDto(
    overrides: CreateSchoolgroupUseCaseDtoMock = {}
): CreateSchoolgroupUseCaseDto {
    return new CreateSchoolgroupUseCaseDto({
        name: overrides.name ?? 'name',
        nameBook: overrides.nameBook ?? "name book",
        scheduleDto: overrides.scheduleDto ?? mockCreateSchoolgroupScheduleUsecaseDto(),
        teacherName: overrides.teacherName ?? 'teacher name'
    })
}