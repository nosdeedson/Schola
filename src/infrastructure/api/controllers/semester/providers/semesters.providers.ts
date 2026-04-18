import { Provider } from "@nestjs/common";
import { semesterRepositoriesProviders } from "./semester-repositories-providers";
import { semesterCreateUsecaseProvider } from "./semester-create-usecase-providers";
import { semesterDeleteUsecaseProvider } from "./semester-delete-usecase-providers";
import { semesterFindAllUsecaseProvider } from "./semester-find-all-usecase-providers";
import { semesterFindUsecaseProvider } from "./semester-find-usecase-providers";
import { semesterUpdateUsecasProvider } from "./semester-update-usecase-providers";

export const providers: Provider[] = [
    ...semesterRepositoriesProviders,
    ...semesterCreateUsecaseProvider,
    ...semesterDeleteUsecaseProvider,
    ...semesterFindUsecaseProvider,
    ...semesterFindAllUsecaseProvider,
    ...semesterUpdateUsecasProvider,
]
