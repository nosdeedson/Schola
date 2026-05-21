import { ApiProperty } from "@nestjs/swagger";
import { UpdateSchoolgroupUsecaseDto } from "@/application/usecases/schoolgroup-usecases/update/update-schoolgroup-usecase.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateSchoolgroupRequestDto {

    @ApiProperty({ description: 'id of schoolgroup' })
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'new book name' })
    @IsNotEmpty()
    nameBook: string;

    @ApiProperty({ description: 'the name of the new teacher of class' })
    @IsNotEmpty()
    teacherName: string;

    static toUpdateSchoolgroupUsecaseDto(dto: UpdateSchoolgroupRequestDto): UpdateSchoolgroupUsecaseDto {
        return new UpdateSchoolgroupUsecaseDto({
            id: dto.id,
            nameBook: dto.nameBook,
            teacherName: dto.teacherName
        });
    }
}
