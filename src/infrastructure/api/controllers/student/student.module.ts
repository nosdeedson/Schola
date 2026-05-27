import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { studentsProviders } from './providers/students.providers';

@Module({
    controllers: [
        StudentController
    ],
    providers: [...studentsProviders],
    imports: []
})
export class StudentModule { }
