import { FindSemesterUsecase } from "@/application/usecases/semester-usecases/find/find-semester-usecase";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { SEMESTER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const semesterFindUsecaseProvider = [
    {
        provide: FindSemesterUsecase,
        useFactory: (semesterRepo: AcademicSemesterRepository) => new FindSemesterUsecase(semesterRepo),
        inject: [SEMESTER_REPOSITORY]
    }
]
