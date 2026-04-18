import { FindAllAcademicSemesterDto } from "@/application/services/academic-semester/findAll/findAll.academic-semester.dto";
import { FindAllAcademicSemesterService } from "@/application/services/academic-semester/findAll/findAll.academic-semester.service";
import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";

export class FindAllSemesterUsecase {

    constructor(private semesterRepository: AcademicSemesterRespositoryInterface) { }

    async execute(): Promise<FindAllAcademicSemesterDto> {
        let all = new FindAllAcademicSemesterService(this.semesterRepository);
        return await all.execute();
    }
}
