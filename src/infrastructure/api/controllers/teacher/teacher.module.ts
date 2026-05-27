import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { teachersProviders } from './providers/teachers-providers';

@Module({
    controllers: [
        TeacherController
    ],
    providers: [...teachersProviders],
    imports: []
})
export class TeacherModule { }
