import { StudentRatingUsecaseResponseDto } from '@/application/usecases/find-student-rating/find-stdent-rating-usecase-dto-out';
import { FindStudentRantingUsecase } from '@/application/usecases/find-student-rating/find-student-rating-usecase';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TransferStudendtsRequestDto } from './dto/transfer-students-request-dto';
import { TransferStudentsAnotherClassUsecase } from '@/application/usecases/transfer-students/transfer-students-another-class.usecase';
import { SaveRatingUsecase } from '@/application/usecases/save-rating/save-rating-usecase';
import { SaveRatingRequestDto } from './dto/save-rating-request-dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Student")
@Controller('students')
export class StudentController {

    constructor(
        private studentRating: FindStudentRantingUsecase,
        private transferStudents: TransferStudentsAnotherClassUsecase,
        private saveRatingUsecase: SaveRatingUsecase
    ) { }

    @Get("find-raintgs/:studentId")
    public async findRatingStudent(@Param('studentId') studentId: string): Promise<StudentRatingUsecaseResponseDto[]> {
        return await this.studentRating.execute(studentId);
    }

    @Patch("transfer-students")
    public async transferStudentsAnotherClass(@Body() dto: TransferStudendtsRequestDto) {
        await this.transferStudents.execute(dto.toUsecaseDto());
    }

    @Post('save-rating')
    public async saveRating(@Body() dto: SaveRatingRequestDto) {
        // TODO WHEN SAVE RATING STUDENT LOST THE CLASS ID
        this.saveRatingUsecase.execute(dto.toUseCaseDto());
    }
}
