import { CreateClassDto } from "@/application/services/class/create/create.class.dto";
import { ScheduleRequestDto } from "@/infrastructure/api/controllers/schoolgroup/dto/create/create-schoolgroup-request-dto";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { CreateSchoolgroupScheduleUsecaseDto } from "./create-schoolgroup-schedule-usecase.dto";


export class CreateSchoolgroupUseCaseDto {

    name: string;
    nameBook: string;
    scheduleDto: CreateSchoolgroupScheduleUsecaseDto;
    teacherName: string;

    constructor(params: {
        nameBook: string;
        name: string;
        scheduleDto: ScheduleRequestDto;
        teacherName: string;
    }) {
        this.name = params.name;
        this.nameBook = params.nameBook;
        this.scheduleDto = new CreateSchoolgroupScheduleUsecaseDto({
            dayOfWeeks: params.scheduleDto.dayOfWeeks,
            times: params.scheduleDto.times
        });
        this.teacherName = params.teacherName
    }

    toCreateClassDto(teacher: WorkerEntity): CreateClassDto {
        return new CreateClassDto(
            this.nameBook, 
            this.name, 
            this.scheduleDto.toScheduleDto(),
            null,
            teacher
        );
    }



}