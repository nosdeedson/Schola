import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { AcademicSemesterEntity } from "@/infrastructure/entities/academic-semester/academic.semester.entity";
import { SystemError } from "../../@shared/system-error";
import { AcademicSemester } from "@/domain/academc-semester/academic.semester";

export class FindCurrentSemesterService {

    private semesterRepository: AcademicSemesterRespositoryInterface;
    constructor(semesterRepository: AcademicSemesterRespositoryInterface) {
        this.semesterRepository = semesterRepository;
    }

    async execute(): Promise<AcademicSemester> {
        try {
            const semester = await this.semesterRepository.findCurrentSemester();
            if (!semester) throw new SystemError([
                { context: 'semester', message: 'semester not found' }],
                404
            );
            return semester;
        } catch (error) {
            throw error;
        }
    }
}
