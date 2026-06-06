import { DeleteSemesterUsecase } from "@/application/usecases/semester-usecases/delete/delete-semester-usecase";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { SEMESTER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const semesterDeleteUsecaseProvider = [
    {
        provide: DeleteSemesterUsecase,
        useFactory: (semesterRepo: AcademicSemesterRepository) => new DeleteSemesterUsecase(semesterRepo),
        inject: [SEMESTER_REPOSITORY]
    }
]
