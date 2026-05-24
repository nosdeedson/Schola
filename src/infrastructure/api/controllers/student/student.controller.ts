import { StudentRatingUsecaseResponseDto } from '@/application/usecases/find-student-rating/student-rating-usecase-response-dto';
import { FindStudentRantingUsecase } from '@/application/usecases/find-student-rating/find-student-rating-usecase';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TransferStudendtsRequestDto } from './dto/transfer-students-request-dto';
import { TransferStudentsAnotherClassUsecase } from '@/application/usecases/transfer-students/transfer-students-another-class.usecase';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Student")
@Controller('students')
export class StudentController {

    constructor(
        private studentRating: FindStudentRantingUsecase,
        private transferStudents: TransferStudentsAnotherClassUsecase,
    ) { }

    @ApiOperation({ description: "Find the student rating", })
    @ApiResponse({ status: 200 })
    @Get("ratings/:studentId")
    public async findRatingStudent(@Param('studentId') studentId: string): Promise<StudentRatingUsecaseResponseDto[]> {
        return await this.studentRating.execute(studentId);
    }

    @ApiOperation({ description: "Transfer the student from one class to another" })
    @Patch("transfer-students")
    public async transferStudentsAnotherClass(@Body() dto: TransferStudendtsRequestDto) {
        await this.transferStudents.execute(TransferStudendtsRequestDto.toUsecaseDto(dto));
    }
}
