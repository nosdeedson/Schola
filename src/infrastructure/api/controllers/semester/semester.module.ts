import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { providers } from './providers/semesters.providers';

@Module({
    controllers: [
        SemesterController
    ],
    providers: [...providers],
    imports: [
        DataBaseConnectionModule,
    ]
})
export class SemesterModule { }
