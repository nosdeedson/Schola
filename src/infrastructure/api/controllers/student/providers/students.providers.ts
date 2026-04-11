import { Provider } from "@nestjs/common";
import { repositoriesProviders } from "./student.repositories-providers";
import { transferStudentUsecaseProvider } from "./student.transfer-student-usecase-provider";
import { findRatingUsecaseProvider } from "./student-find-rating-usecase.provider";

export const providers: Provider[] = [
    ...repositoriesProviders,
    ...transferStudentUsecaseProvider,
    ...findRatingUsecaseProvider,
]
