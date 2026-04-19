import { Provider } from "@nestjs/common";
import { studentsRepositoriesProviders } from "./student-repositories-providers";
import { studentTransferUsecaseProvider } from "./student-transfer-student-usecase-provider";
import { findRatingUsecaseProvider } from "./student-find-rating-usecase.provider";
import { studentSaveRatingUsecaseProvider } from "./student-save-rating-usecase.provider";

export const providers: Provider[] = [
    ...studentsRepositoriesProviders,
    ...studentTransferUsecaseProvider,
    ...findRatingUsecaseProvider,
    ...studentSaveRatingUsecaseProvider
]
