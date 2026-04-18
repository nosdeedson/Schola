import { UpdateAcademicSemesterDto } from "@/application/services/academic-semester/update/udpate.academic-semester.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsUUID } from "class-validator";

export class UpdateAcademicSemesterRequestDto {
    @ApiProperty({ description: 'Id semester' })
    @IsUUID()
    id: string;

    @ApiProperty({ description: 'updating the quarter' })
    @IsBoolean()
    updatingQuarter: boolean;

    @ApiProperty({ description: 'updating the semester' })
    @IsBoolean()
    updatingSemester: boolean;

    toUsecaseDto(): UpdateAcademicSemesterDto {
        return new UpdateAcademicSemesterDto({
            id: this.id,
            updatingQuarter: this.updatingQuarter,
            updatingSemester: this.updatingSemester
        })
    }
}
