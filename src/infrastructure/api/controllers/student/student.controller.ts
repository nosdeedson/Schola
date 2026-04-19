import { StudentRatingUsecaseDtoOut } from '@/application/usecases/find-student-rating/find-stdent-rating-usecase-dto-out';
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

    @Get(":studentId")
    public async findRatingStudent(@Param('studentId') studentId: string): Promise<StudentRatingUsecaseDtoOut> {
        return await this.studentRating.execute(studentId);
    }

    @Patch("transfer-students")
    public async transferStudentsAnotherClass(@Body() dto: TransferStudendtsRequestDto) {
        await this.transferStudents.execute(dto.toUsecaseDto());
    }

    @Post('save-rating')
    public async saveRating(@Body() dto: SaveRatingRequestDto) {
        this.saveRatingUsecase.execute(dto.toUseCaseDto());
    }
}
