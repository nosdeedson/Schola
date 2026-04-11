import { StudentRatingUsecaseDtoOut } from '@/application/usecases/find-student-rating/find-stdent-rating-usecase-dto-out';
import { FindStudentRantingUsecase } from '@/application/usecases/find-student-rating/find-student-rating-usecase';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { TransferStudendtsRequestDto } from './dtos/transfer-students-request-dto';
import { TransferStudentsAnotherClassUsecase } from '@/application/usecases/transfer-students/transfer-students-another-class.usecase';

@Controller('students')
export class StudentController {

    constructor(
        private studentRating: FindStudentRantingUsecase,
        private transferStudents: TransferStudentsAnotherClassUsecase
    ) { }

    @Get(":studentId")
    public async findRatingStudent(@Param('studentId') studentId: string): Promise<StudentRatingUsecaseDtoOut> {
        return await this.studentRating.execute(studentId);
    }

    @Patch("transfer-students")
    public async transferStudentsAnotherClass(@Body() dto: TransferStudendtsRequestDto) {
        this.transferStudents.execute(dto.toUsecaseDto());
    }
}
