import { DeleteAcademicSemesterService } from "@/application/services/academic-semester/delete/delete.academic-semester.service";
import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";

export class DelesteSemesterUsecase {

    constructor(private semesterRepository: AcademicSemesterRespositoryInterface) { }

    async execute(id: string): Promise<void> {
        let deleteService = new DeleteAcademicSemesterService(this.semesterRepository);
        await deleteService.execute(id);
    }
}
