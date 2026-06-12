import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { FindAcademicSemesterDto } from "./find.academic-semester.dto";
import { SystemError } from "@/application/services/@shared/system-error";

export class FindAcademicSemesterService {

    private semesterRepository: AcademicSemesterRespositoryInterface;

    constructor(semesterRepository: AcademicSemesterRespositoryInterface) {
        this.semesterRepository = semesterRepository;
    }

    async execute(id: string): Promise<FindAcademicSemesterDto> {
        try {
            let semester = await this.semesterRepository.find(id);
            if (!semester) {
                throw new SystemError([
                    { context: 'academicSemester', message: 'Academic Semester not found' }],
                    404
                );
            }
            const firstQuarter = semester.getFirstQuarter();
            const secondQuarter = semester.getSecondQuarter();
            let dto = new FindAcademicSemesterDto({ id: semester.getId(), current: semester.getCurrentSemester(), firstQuarter: firstQuarter, secondQuarter: secondQuarter });
            return dto;
        } catch (error) {
            throw error;
        }
    }
}
