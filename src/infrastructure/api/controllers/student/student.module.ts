import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { RepositoryFactoryService } from '@/infrastructure/factory/repositiry-factory/repository-factory.service';
import { FindStudentRantingUsecase } from '@/application/usecases/find-student-rating/find-student-rating-usecase';
import { providers } from './providers/students.providers';

@Module({
    controllers: [
        StudentController
    ],
    providers: [
        //RepositoryFactoryService,
        //FindStudentRantingUsecase,
        ...providers
    ],
    imports: [
        DataBaseConnectionModule
    ]
})
export class StudentModule { }
