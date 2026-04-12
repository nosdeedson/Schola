import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";

export class FindCurrentSemesterService {

    private semesterRepository: AcademicSemesterRespositoryInterface;
    constructor(semesterRepository: AcademicSemesterRespositoryInterface) {
        this.semesterRepository = semesterRepository;
    }

    async execute(): Promise<AcademicSemesterEntity> {
        try {
            return this.semesterRepository.findCurrentSemester();
        } catch (error) {
            throw error;
        }
    }
}
