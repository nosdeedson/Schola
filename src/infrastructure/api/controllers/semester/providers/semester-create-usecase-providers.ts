import { CreateSemesterUsecase } from "@/application/usecases/semester-usecases/create/create-semester-usecase";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { SEMESTER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const semesterCreateUsecaseProvider = [
    {
        provide: CreateSemesterUsecase,
        useFactory: (
            semesterRepo: AcademicSemesterRepository
        ) =>  new CreateSemesterUsecase(semesterRepo),
        inject: [SEMESTER_REPOSITORY]
    }
]
