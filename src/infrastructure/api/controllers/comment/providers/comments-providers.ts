import { Provider } from "@nestjs/common";
import { commentRepositoriesProviders } from "./comment-repositories-providers";
import { commentinRatingUsecaseProvider } from "./comment-rating-usecase.provider";

export const commentsProviders: Provider[] = [
    ...commentRepositoriesProviders,
    ...commentinRatingUsecaseProvider,
]
