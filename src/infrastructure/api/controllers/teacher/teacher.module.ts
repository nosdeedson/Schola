import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { teacherProviders } from './providers/teacher-providers';

@Module({
    controllers: [
        TeacherController
    ],
    providers: [...teacherProviders],
    imports: []
})
export class TeacherModule { }
