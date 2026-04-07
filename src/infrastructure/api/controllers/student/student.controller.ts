import { StudentRatingUsecaseDtoOut } from '@/application/usecases/find-student-rating/find-stdent-rating-usecase-dto-out';
import { FindStudentRantingUsecase } from '@/application/usecases/find-student-rating/find-student-rating-usecase';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('students')
export class StudentController {

    constructor(private studentRating: FindStudentRantingUsecase) { }

    @Get(":studentId")
    public async findRatingStudent(@Param('studentId') studentId: string): Promise<StudentRatingUsecaseDtoOut> {
        return await this.studentRating.execute(studentId);
    }
}
