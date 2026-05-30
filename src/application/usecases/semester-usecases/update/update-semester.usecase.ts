import { UpdateAcademicSemesterDto } from "@/application/services/academic-semester/update/udpate.academic-semester.dto";
import { UpdateAcademicSemesterService } from "@/application/services/academic-semester/update/update.academic-semester.service";
import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";
import { SystemError } from "@/application/services/@shared/system-error";

export class UpdateSemesterUseCase {

    constructor(private semesterRepository: AcademicSemesterRespositoryInterface) { }

    async execute(updateSemester: UpdateAcademicSemesterDto) {
        try {
            const updateSemesterService = new UpdateAcademicSemesterService(this.semesterRepository);
            await updateSemesterService.execute(updateSemester);
        } catch (error) {
            ExceptionHandler.exceptionHandler(error as SystemError);
        }
    }
}
