import { Module } from '@nestjs/common';
import { DataBaseConnectionModule } from '@/infrastructure/data-base-connection/data-base-connection.module';
import { UsersController } from './users.controller';
import { UserUsecasesService } from '../../../../application/usecases/user-usecases/user-usecases.service';
import { RepositoryFactoryService } from '@/infrastructure/factory/repositiry-factory/repository-factory.service';
import { DeleteUserFactoryService } from '@/infrastructure/factory/delete-user-factory/delete-user-factory.service';
import { UserAggregateResolverService } from '@/infrastructure/factory/user-aggregate-resolver/user-aggregate-resolver.service';
import { FindUserFactoryService } from '@/infrastructure/factory/find-user-factory/find-user-factory.service';
import { CreateUserFactoryService } from '@/infrastructure/factory/create-user-service-factory/create-user-factory-service';
import { IsStrongPasswordConstraint } from '../../validators/is-strong-password-constraint/is-strong-password-constraint';
import { CreateUserUsecase } from '@/application/usecases/user-usecases/create-user/create-user-usecase';
import { userProviders } from './providers/user-provider';

@Module({
    controllers: [
        UsersController,
    ],
    providers: [
        ...userProviders,
        IsStrongPasswordConstraint,
        RepositoryFactoryService,
        CreateUserFactoryService,
        DeleteUserFactoryService,
        UserAggregateResolverService,
    ],
    exports: [
    ],
    imports: [
        DataBaseConnectionModule,
    ]
})
export class UsersModule { }
