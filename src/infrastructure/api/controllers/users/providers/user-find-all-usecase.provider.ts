import { FindAllUserUsecase } from "@/application/usecases/user-usecases/find-all/find-all-user-usecase";
import { UserRepository } from "@/infrastructure/repositories/user/user.repository";
import { USER_REPOSITORY } from "../../controller-tokens/controller-tokens";


export const userFindAllUsecaseProvider = [
    {
        provide: FindAllUserUsecase,
        useFactory: (userRepo: UserRepository) => new FindAllUserUsecase(userRepo),
        inject: [USER_REPOSITORY]
    }
]
