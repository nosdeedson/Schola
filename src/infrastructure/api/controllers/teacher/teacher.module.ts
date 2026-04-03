import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherListClassesUsecase } from 'src/application/usecases/teacher-list-classes-usecase/teacher-list-classes-usecase';
import { RepositoryFactoryService } from '@/infrastructure/factory/repositiry-factory/repository-factory.service';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { ClassRepository } from '@/infrastructure/repositories/class/class.repository';
import { FindTeacherClassRatingUsecase } from 'src/application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-usecase';

@Module({
    controllers: [
        TeacherController
    ],
    providers: [
        TeacherListClassesUsecase,
        RepositoryFactoryService,
        ClassRepository,
        FindTeacherClassRatingUsecase,
    ], 
    imports: [
        DataBaseConnectionModule,
    ]
})
export class TeacherModule {}
