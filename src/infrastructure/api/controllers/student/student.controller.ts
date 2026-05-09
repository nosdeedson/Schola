import { StudentRatingUsecaseResponseDto } from '@/application/usecases/find-student-rating/find-stdent-rating-usecase-dto-out';
import { FindStudentRantingUsecase } from '@/application/usecases/find-student-rating/find-student-rating-usecase';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TransferStudendtsRequestDto } from './dto/transfer-students-request-dto';
import { TransferStudentsAnotherClassUsecase } from '@/application/usecases/transfer-students/transfer-students-another-class.usecase';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentCommentRatingRequestDto } from './dto/student-comment-rating-request.dto';
import { StudentCommentRatingUsecase } from '@/application/usecases/student-comment-rating/student-comment-rating-usecase';

@ApiTags("Student")
@Controller('students')
export class StudentController {

    constructor(
        private studentRating: FindStudentRantingUsecase,
        private transferStudents: TransferStudentsAnotherClassUsecase,
        private studentCommentRating: StudentCommentRatingUsecase
    ) { }

    @ApiOperation({ description: "Find the student rating", })
    @ApiResponse({ status: 200 })
    @Get("find-raintgs/:studentId")
    public async findRatingStudent(@Param('studentId') studentId: string): Promise<StudentRatingUsecaseResponseDto[]> {
        return await this.studentRating.execute(studentId);
    }

    @ApiOperation({ description: "Transfer the student from one class to another" })
    @Patch("transfer-students")
    public async transferStudentsAnotherClass(@Body() dto: TransferStudendtsRequestDto) {
        await this.transferStudents.execute(dto.toUsecaseDto());
    }

    @ApiOperation({ description: 'save a comment of a rating of the student' })
    @Post('ratings/comments')
    public async commentingRating(@Body() dto: StudentCommentRatingRequestDto) {
        this.studentCommentRating.execute(dto.toStudentCommentRatingUsecaseDto());
    }
}
