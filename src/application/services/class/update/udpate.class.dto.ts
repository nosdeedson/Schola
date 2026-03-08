import { WorkerEntity } from "src/infrastructure/entities/worker/worker.entity";

export class UpdateClassDto{
    id: string;
    nameBook: string;
    teacher: WorkerEntity;

    constructor(
        id: string,
        nameBook: string,
        teacher: WorkerEntity,
    ){
        this.nameBook = nameBook;
        this.teacher = teacher;
        this.id = id;
    }
}