import { CreateUserUsecase } from "@/application/usecases/user-usecases/create-user/create-user-usecase";
import { CreateUserFactoryService } from "@/infrastructure/factory/create-user-service-factory/create-user-factory-service";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { PARENT_REPOSITORY, STUDENT_REPOSITORY, USER_REPOSITORY, WORKER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const userCreateUsecaseProvider = [
    {
        provide: CreateUserUsecase,
        useFactory: (
            createFactory: CreateUserFactoryService,
            repoFactory: RepositoryFactoryService,
        ) => new CreateUserUsecase(createFactory, repoFactory),
        inject: [USER_REPOSITORY, PARENT_REPOSITORY, STUDENT_REPOSITORY, WORKER_REPOSITORY]
    }
]
