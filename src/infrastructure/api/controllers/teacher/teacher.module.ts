import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { teacherProviders } from './providers/teacher-providers';

@Module({
    controllers: [
        TeacherController
    ],
    providers: [...teacherProviders],
    imports: [
        DataBaseConnectionModule,
    ]
})
export class TeacherModule { }
