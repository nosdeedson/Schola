import { FindTeacherClassRatingUsecase } from "@/application/usecases/find-teacher-class-rating-usecase/find-teacher-class-rating-usecase";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";

export const teacherFindClassRatingUsecaseProvider = [
    {
        provide: FindTeacherClassRatingUsecase,
        useFactory: (
            classRepo: ClassRepository,
            semesterRepo: AcademicSemesterRepository,
        ) => {
            return new FindTeacherClassRatingUsecase(
                classRepo, semesterRepo
            )
        }
    }
]
