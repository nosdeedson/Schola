import { StudentRatingUsecaseDtoOut } from '@/application/usecases/student-rating/stdent-rating-usecase-dto-out';
import { StudentRantingUsecase } from '@/application/usecases/student-rating/student-rating-usecase';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('students')
export class StudentController {

    constructor(private studentRating: StudentRantingUsecase) { }

    @Get(":studentId")
    public async findRatingStudent(@Param('studentId') studentId: string): Promise<StudentRatingUsecaseDtoOut> {
        return await this.studentRating.execute(studentId);
    }
}
