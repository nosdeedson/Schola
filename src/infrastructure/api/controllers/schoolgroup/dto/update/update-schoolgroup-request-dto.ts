import { ApiProperty } from "@nestjs/swagger";
import { UpdateClassUsecaseDto } from "src/application/services/class/update/udpate.class.dto";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";

export class UpdateSchoolgroupRequestDto{
    @ApiProperty({description: 'id of schoolgroup'})
    id: string;

    @ApiProperty({description: 'the name of the new teacher of class'})
    teacherName: string;

    @ApiProperty({description: 'new book name'})
    nameBook: string;

    toInput(teacher: WorkerEntity): UpdateClassUsecaseDto{
        return new UpdateClassUsecaseDto(
            this.id,
            this.nameBook,
            teacher
        )
    }
}