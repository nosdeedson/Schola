import { CreateAcademicSemesterService } from "@/application/services/academic-semester/create/create.academic-semester.service";
import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { CreateAcademicSemesterUsecaseDto } from "@/application/services/academic-semester/create/semester/create-academic-semester-usecase.dto";
import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";
import { SystemError } from "@/application/services/@shared/system-error";

export class CreateSemesterUsecase {

    constructor(
        private repository: AcademicSemesterRespositoryInterface,
    ) { }

    async execute(dto: CreateAcademicSemesterUsecaseDto): Promise<void> {
        try {
            let createServive = new CreateAcademicSemesterService(this.repository);
            await createServive.execute(dto);
        } catch (error) {
            ExceptionHandler.exceptionHandler(error as SystemError);
        }
    }

}
