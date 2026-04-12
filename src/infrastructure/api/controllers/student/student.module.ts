import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { providers } from './providers/students.providers';

@Module({
    controllers: [
        StudentController
    ],
    providers: [...providers],
    imports: [
        DataBaseConnectionModule
    ]
})
export class StudentModule { }
