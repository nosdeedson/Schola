import { UpdateClassDto } from "@/application/services/class/update/udpate.class.dto";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";

export class UpdateSchoolgroupUsecaseDto {
    id: string;
    nameBook: string;
    teacherName: string;

    constructor(params: {
        id: string,
        nameBook: string,
        teacherName: string,
    }) {
        this.id = params.id;
        this.nameBook = params.nameBook;
        this.teacherName = params.teacherName;
    }

    toInput(teacher: WorkerEntity): UpdateClassDto {
        const dto = new UpdateClassDto(
            this.id,
            this.nameBook,
            teacher
        );
        return dto;
    }
}