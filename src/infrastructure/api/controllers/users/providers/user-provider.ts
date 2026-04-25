import { Provider } from "@nestjs/common";
import { userRepositoriesProviders } from "./user-repositories-providers";
import { userCreateUsecaseProvider } from "./user-create-usecase-providers";
import { userDeleteUsecaseProvider } from "./user-delete-usecase-providers";
import { userFindUsecaseProvider } from "./user-find-usecase-providers";
import { userFindAllUsecaseProvider } from "./user-find-all-usecase.provider";


export const userProviders: Provider[] = [
    ...userRepositoriesProviders,
    ...userCreateUsecaseProvider,
    ...userDeleteUsecaseProvider,
    ...userFindUsecaseProvider,
    ...userFindAllUsecaseProvider,
]
