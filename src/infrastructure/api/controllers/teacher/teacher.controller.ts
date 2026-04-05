import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { FindTeacherClassRatingUsecase } from '@/application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-usecase';
import { TeacherListClassesUsecase } from '@/application/usecases/teacher-list-classes-usecase/teacher-list-classes-usecase';

@Controller('teacher')
export class TeacherController {

    constructor(
        private teacherListClasses: TeacherListClassesUsecase,
        private teacherClassRating: FindTeacherClassRatingUsecase
    ){}

    @ApiOperation({description: "find teacher classes"})
    @Get('/:idTeacher')
    async findTeacherClasses(@Param("idTeacher", new ParseUUIDPipe()) idTeacher: string){
        return this.teacherListClasses.execute(idTeacher);
    }

    @ApiOperation({description: "find teacher's class to rate"})
    @Get(':teacherId/class/:classid')
    async findTeacherClassRating(@Param('teacherId', new ParseUUIDPipe()) teacherId: string, 
        @Param('classId', new ParseUUIDPipe()) classId: string){
            return this.teacherClassRating.execute(teacherId, classId);
    }
}
