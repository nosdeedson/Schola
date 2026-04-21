import { CreateUserUsecase } from "@/application/usecases/user-usecases/create-user/create-user-usecase";
import { CreateUserFactoryService } from "@/infrastructure/factory/create-user-service-factory/create-user-factory-service";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";

export const userCreateUsecaseProvider = [
    {
        provide: CreateUserUsecase,
        useFactory: (
            repoFactory: RepositoryFactoryService,
            createUserFactory: CreateUserFactoryService,
        ) => new CreateUserUsecase(createUserFactory, repoFactory),
        inject: [RepositoryFactoryService, CreateUserFactoryService,]
    }
]
