import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { semestersProviders } from './providers/semesters.providers';

@Module({
    controllers: [
        SemesterController
    ],
    providers: [...semestersProviders],
    imports: [ ]
})
export class SemesterModule { }
