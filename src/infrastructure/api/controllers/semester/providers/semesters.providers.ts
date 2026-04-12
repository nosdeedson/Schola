import { Provider } from "@nestjs/common";
import { semesterRepositoriesProviders } from "./semester-repositories-providers";
import { semesterCreateUsecaseProvider } from "./semester-create-usecase-providers";

export const providers: Provider[] = [
    ...semesterRepositoriesProviders,
    ...semesterCreateUsecaseProvider,
]
