import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { providers } from './providers/students.providers';

@Module({
    controllers: [
        StudentController
    ],
    providers: [...providers],
    imports: []
})
export class StudentModule { }
