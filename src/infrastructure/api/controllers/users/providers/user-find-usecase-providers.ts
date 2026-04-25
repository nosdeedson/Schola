import { FindUserUsecase } from "@/application/usecases/user-usecases/find/find-user-usecase";
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
