import { Provider } from "@nestjs/common";
import { schoolgroupRepositoriesProviders } from "./schoolgroup-repositories-provider";
import { schoolgroupCreateUseCaseProvider } from "./schoolgroup-create-usecase.provider";
import { schoolgroupUpdateUsecaseProvider } from "./schoolgroup-update-usecase.provider";
import { schoolgroupFindUsecaseProvider } from "./schoolgroup-find-usecase.provider";
import { schoolgroupDeleteProvider } from "./schoolgroup-delete-usecase.provider";
import { schoolgroupFindAllUsecaseProvider } from "./schoolgroup-find-all-usecase.provider";
import { transactionServiceProvider } from "../../controller-tokens/transaction-service.provider";

export const providers: Provider[] = [
    ...schoolgroupRepositoriesProviders,
    ...schoolgroupCreateUseCaseProvider,
    ...schoolgroupUpdateUsecaseProvider,
    ...schoolgroupFindUsecaseProvider,
    ...schoolgroupDeleteProvider,
    ...schoolgroupFindAllUsecaseProvider,
    ...transactionServiceProvider,
]
