import { TransferStudentsAnotherClassUseCaseDto } from "@/application/usecases/transfer-students/transfer-students-another-class-usecase-dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class TransferStudendtsRequestDto {
    @ApiProperty({
        description: "Ids of the students that will be enrolled in another class"
    })
    @IsArray()
    studentIds: string[];

    @ApiProperty({
        description: "The class id in which the students will be enrolled"
    })
    classId: string;

    toUsecaseDto(): TransferStudentsAnotherClassUseCaseDto {
        return new TransferStudentsAnotherClassUseCaseDto(this.studentIds, this.classId)
    }
}
