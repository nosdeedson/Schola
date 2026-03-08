import { WorkerEntity } from "src/infrastructure/entities/worker/worker.entity";
import { ScheduleDto } from "./schedule-dto";

export class CreateClassDto{
    
    classCode?: string;
    nameBook: string;
    name: string;
    scheduleDto: ScheduleDto;
    teacherEntity?: WorkerEntity;

    constructor(
        nameBook: string,
        name: string,
        scheduleDto: ScheduleDto,
        classCode?: string,
        teacherEntity?: WorkerEntity,
    ){
        this.classCode = classCode;
        this.nameBook = nameBook;
        this.name = name;
        this.scheduleDto = scheduleDto as ScheduleDto;
        this.teacherEntity = teacherEntity;
    }
}