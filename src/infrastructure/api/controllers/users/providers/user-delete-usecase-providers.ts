import { DeleteUserUsecase } from "@/application/usecases/user-usecases/delete/delete-user-usecase";
import { DeleteUserFactoryService } from "@/infrastructure/factory/delete-user-factory/delete-user-factory.service";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";

export const userDeleteUsecaseProvider = [
    {
        provide: DeleteUserUsecase,
        useFactory: (
            repoFactory: RepositoryFactoryService,
            userDeleteFactory: DeleteUserFactoryService,
        ) => new DeleteUserUsecase(userDeleteFactory, repoFactory),
        inject: [RepositoryFactoryService, DeleteUserFactoryService]
    }
]