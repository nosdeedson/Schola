import { AcademicSemesterInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";

export class FindCurrentSemesterService {

    private semesterRepository: AcademicSemesterInterface;
    constructor(semesterRepository: AcademicSemesterInterface){
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