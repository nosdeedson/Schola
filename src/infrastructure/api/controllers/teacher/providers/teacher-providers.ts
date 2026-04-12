import { Provider } from "@nestjs/common";
import { teachersRepositoriesProviders } from "./teachers-repositories-providers";
import { teacherListClassesUsecaseProvider } from "./teacher-list-classes-usecase.providers";
import { teacherFindClassRatingUsecaseProvider } from "./teacher-find-class-rating-usecase.providers";


export const teacherProviders: Provider[] = [
    ...teachersRepositoriesProviders,
    ...teacherListClassesUsecaseProvider,
    ...teacherFindClassRatingUsecaseProvider
]
