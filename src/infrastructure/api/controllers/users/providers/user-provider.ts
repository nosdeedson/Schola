import { Provider } from "@nestjs/common";
import { userRepositoriesProviders } from "./user-repositories-providers";
import { userCreateUsecaseProvider } from "./user-create-usecase-providers";


export const userProviders: Provider[] = [
    ...userRepositoriesProviders,
    ...userCreateUsecaseProvider,
]
