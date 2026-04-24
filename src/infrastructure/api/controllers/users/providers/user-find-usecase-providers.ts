import { FindUserUsecase } from "@/application/usecases/user-usecases/find/find-user-usecase";
import { FindUserFactoryService } from "@/infrastructure/factory/find-user-factory/find-user-factory.service";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { UserRepository } from "@/infrastructure/repositories/user/user.repository";
import { USER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const userFindUsecaseProvider = [
    {
        provide: FindUserUsecase,
        useFactory: (
            userRepo: UserRepository,
        ) => new FindUserUsecase(userRepo),
        inject: [USER_REPOSITORY]
    }
]