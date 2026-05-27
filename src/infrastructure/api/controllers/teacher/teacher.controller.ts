import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindTeacherClassRatingUsecase } from '@/application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-usecase';
import { TeacherListClassesUsecase } from '@/application/usecases/teacher-list-classes-usecase/teacher-list-classes-usecase';
import { ClassesOfTeacherDto } from '@/application/usecases/teacher-list-classes-usecase/classes-of-teacher-dto';
import { TeacherClassRatingDto } from '@/application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-dto';

@ApiTags("Teacher")
@Controller('teachers')
export class TeacherController {

    constructor(
        private teacherListClasses: TeacherListClassesUsecase,
        private teacherClassRating: FindTeacherClassRatingUsecase
    ) { }

    @ApiOperation({ description: "find teacher classes" })
    @Get('/:idTeacher')
    async findTeacherClasses(@Param("idTeacher", new ParseUUIDPipe()) idTeacher: string): Promise<ClassesOfTeacherDto[]> {
        return await this.teacherListClasses.execute(idTeacher);
    }

    @ApiOperation({ description: "find teacher's class to rate" })
    @Get(':teacherId/classes/:classId')
    async findTeacherClassRating(
        @Param('teacherId', new ParseUUIDPipe()) teacherId: string,
        @Param('classId', new ParseUUIDPipe()) classId: string): Promise<TeacherClassRatingDto> {
        return await this.teacherClassRating.execute(teacherId, classId);
    }
}
