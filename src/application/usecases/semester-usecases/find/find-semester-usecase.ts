import { SystemError } from "@/application/services/@shared/system-error";
import { FindAcademicSemesterDto } from "@/application/services/academic-semester/find/find.academic-semester.dto";
import { FindAcademicSemesterService } from "@/application/services/academic-semester/find/find.academic-semester.service";
import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";

export class FindSemesterUsecase {
    constructor(private semesterRepository: AcademicSemesterRespositoryInterface) { }

    async execute(id: string): Promise<FindAcademicSemesterDto> {
        try {
            let findService = new FindAcademicSemesterService(this.semesterRepository);
            return await findService.execute(id);
        } catch (error) {
            ExceptionHandler.exceptionHandler(error as SystemError);
        }
    }
}
