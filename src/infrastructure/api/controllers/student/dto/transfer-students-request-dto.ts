import { TransferStudentsAnotherClassUseCaseDto } from "@/application/usecases/transfer-students/transfer-students-another-class-usecase-dto";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class TransferStudendtsRequestDto {
    @ApiProperty({
        description: "Ids of the students that will be enrolled in another class"
    })
    @IsArray({ message: "Must be an array of UUID", always: true })
    @ArrayNotEmpty({ message: "List of students must have at least one UUID" })
    @IsUUID('all', { each: true, message: "Each string should be an UUID" })
    studentIds: string[];

    @ApiProperty({
        description: "The class id in which the students will be enrolled"
    })
    @IsUUID("all", { message: "Class Id is required" })
    classId: string;

    static toUsecaseDto(dto: TransferStudendtsRequestDto): TransferStudentsAnotherClassUseCaseDto {
        return new TransferStudentsAnotherClassUseCaseDto(dto.studentIds, dto.classId)
    }
}
