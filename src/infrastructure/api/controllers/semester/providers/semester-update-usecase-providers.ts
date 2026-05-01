import { UpdateSemesterUseCase } from "@/application/usecases/semester-usecases/update/update-semester.usecase";
import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { SEMESTER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const semesterUpdateUsecasProvider = [
    {
        provide: UpdateSemesterUseCase,
        useFactory: (
            semesterRepo: AcademicSemesterRepository
        ) => new UpdateSemesterUseCase(semesterRepo),
        inject: [SEMESTER_REPOSITORY]
    }
]
