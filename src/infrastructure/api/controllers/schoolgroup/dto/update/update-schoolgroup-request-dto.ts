import { ApiProperty } from "@nestjs/swagger";
import { UpdateSchoolgroupUsecaseDto } from "@/application/usecases/schoolgroup-usecases/update/update-schoolgroup-usecase.dto";

export class UpdateSchoolgroupRequestDto {

    @ApiProperty({ description: 'id of schoolgroup' })
    id: string;

    @ApiProperty({ description: 'new book name' })
    nameBook: string;

    @ApiProperty({ description: 'the name of the new teacher of class' })
    teacherName: string;

    static toUpdateSchoolgroupUsecaseDto(dto: UpdateSchoolgroupRequestDto): UpdateSchoolgroupUsecaseDto {
        return new UpdateSchoolgroupUsecaseDto({
            id: dto.id,
            nameBook: dto.nameBook,
            teacherName: dto.teacherName
        });
    }
}
