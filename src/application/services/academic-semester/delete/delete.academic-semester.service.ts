import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";

export class DeleteAcademicSemesterService {

    private semesterRepository: AcademicSemesterRespositoryInterface;

    constructor(semesterRepository: AcademicSemesterRespositoryInterface) {
        this.semesterRepository = semesterRepository;
    }

    async execute(id: string) {
            await this.semesterRepository.delete(id);
    }
}
