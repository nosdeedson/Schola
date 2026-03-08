import { ApiProperty } from "@nestjs/swagger";
import { UpdateClassDto } from "src/application/services/class/update/udpate.class.dto";
import { WorkerEntity } from "src/infrastructure/entities/worker/worker.entity";

export class UpdateSchoolgroupDto{
    @ApiProperty({description: 'id of schoolgroup'})
    id: string;

    @ApiProperty({description: 'the name of the new teacher of class'})
    teacherName: string;

    @ApiProperty({description: 'new book name'})
    nameBook: string;

    toInput(teacher: WorkerEntity): UpdateClassDto{
        return new UpdateClassDto(
            this.id,
            this.nameBook,
            teacher
        )
    }
}