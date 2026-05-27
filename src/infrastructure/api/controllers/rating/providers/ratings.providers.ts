import { Provider } from "@nestjs/common";
import { ratingRepositoriesProvider } from "./rating-repositories-providers";
import { ratingSaveUsecaseProvider } from "./rating-save-usecase.provider";

export const ratingsProviders: Provider[] = [
    ...ratingRepositoriesProvider,
    ...ratingSaveUsecaseProvider,
]
