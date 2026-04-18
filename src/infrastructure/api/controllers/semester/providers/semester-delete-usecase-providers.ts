import { DelesteSemesterUsecase } from "@/application/usecases/semester-usecases/delete/delete-semester-usecase";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { SEMESTER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const semesterDeleteUsecaseProvider = [
    {
        provide: DelesteSemesterUsecase,
        useFactory: (semesterRepo: AcademicSemesterRepository) => new DelesteSemesterUsecase(semesterRepo),
        inject: [SEMESTER_REPOSITORY]
    }
]
