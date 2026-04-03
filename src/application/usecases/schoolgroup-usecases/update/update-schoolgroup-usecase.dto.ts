import { UpdateClassDto } from "src/application/services/class/update/udpate.class.dto";
import { WorkerEntity } from "src/infrastructure/entities/worker/worker.entity";

export class UpdateSchoolgroupUsecaseDto {
    id: string;
    nameBook: string;
    teacherName: string;

    toInput(teacher: WorkerEntity): UpdateClassDto {
        const dto = new UpdateClassDto(
            this.id,
            this.nameBook,
            teacher
        );
        return dto;
    }
}