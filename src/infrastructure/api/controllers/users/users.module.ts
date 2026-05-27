import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { RepositoryFactoryService } from '@/infrastructure/factory/repositiry-factory/repository-factory.service';
import { DeleteUserFactoryService } from '@/infrastructure/factory/delete-user-factory/delete-user-factory.service';
import { UserAggregateResolverService } from '@/infrastructure/factory/user-aggregate-resolver/user-aggregate-resolver.service';
import { CreateUserFactoryService } from '@/infrastructure/factory/create-user-service-factory/create-user-factory-service';
import { IsStrongPasswordConstraint } from '../../validators/is-strong-password-constraint/is-strong-password-constraint';
import { usersProviders } from './providers/users-provider';

@Module({
    controllers: [
        UsersController,
    ],
    providers: [
        ...usersProviders,
        IsStrongPasswordConstraint,
        RepositoryFactoryService,
        CreateUserFactoryService,
        DeleteUserFactoryService,
        UserAggregateResolverService,
    ],
    exports: [
    ],
    imports: []
})
export class UsersModule { }
