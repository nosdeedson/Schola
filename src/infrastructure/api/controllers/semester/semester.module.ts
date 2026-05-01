import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { providers } from './providers/semesters.providers';

@Module({
    controllers: [
        SemesterController
    ],
    providers: [...providers],
    imports: [ ]
})
export class SemesterModule { }
