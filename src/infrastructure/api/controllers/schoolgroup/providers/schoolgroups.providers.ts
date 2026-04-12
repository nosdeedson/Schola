import { Provider } from "@nestjs/common";
import { schoolgroupRepositoriesProviders } from "./schoolgroup-repositories-provider";
import { schoolgroupCreateUseCaseProvider } from "./schoolgroup-create-usecase.provider";
import { schoolgroupUpdateUsecaseProvider } from "./schoolgroup-update-usecase.provider";

export const providers: Provider[] = [
    ...schoolgroupRepositoriesProviders,
    ...schoolgroupCreateUseCaseProvider,
    ...schoolgroupUpdateUsecaseProvider,
]
