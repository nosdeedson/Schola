import { Module } from '@nestjs/common';
import { SchoolgroupController } from './schoolgroup.controller';
import { SchoolgroupUseCases } from '../../../../application/usecases/schoolgroup-usecases/schoolgroup-usecases';
import { RepositoryFactoryService } from '@/infrastructure/factory/repositiry-factory/repository-factory.service';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { CreateSchoolgroupUseCase } from '@/application/usecases/schoolgroup-usecases/create/create-schoolgroup-usecase';
import { UpdateSchoolgroupUsecase } from '@/application/usecases/schoolgroup-usecases/update/update-schoolgroup-usecase';

@Module({
    controllers: [
        SchoolgroupController,
    ],
    providers: [
        SchoolgroupUseCases,
        RepositoryFactoryService,
        CreateSchoolgroupUseCase,
        UpdateSchoolgroupUsecase,
    ],
    imports: [DataBaseConnectionModule]
})
export class SchoolgroupModule { }
