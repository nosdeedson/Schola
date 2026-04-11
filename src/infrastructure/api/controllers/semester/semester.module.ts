import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { SemesterUsecases } from '../../../../application/usecases/semester-usecases/semester-usecases';
import { CreateAcademicSemesterService } from '@/application/services/academic-semester/create/create.academic-semester.service';
import { AcademicSemesterRepository } from '@/infrastructure/repositories/academic-semester/academic-semester.repository';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { RepositoryFactoryService } from '@/infrastructure/factory/repositiry-factory/repository-factory.service';
import { CreateSemesterUsecase } from '@/application/usecases/semester-usecases/create/create-semester-usecase';

@Module({
    controllers: [
        SemesterController
    ],
    providers: [
        SemesterUsecases,
        CreateAcademicSemesterService,
        AcademicSemesterRepository,
        RepositoryFactoryService,
        CreateSemesterUsecase,
    ],
    imports: [
        DataBaseConnectionModule,
    ]
})
export class SemesterModule { }
