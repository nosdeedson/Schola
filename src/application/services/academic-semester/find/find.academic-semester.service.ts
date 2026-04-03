import { AcademicSemesterInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { FindAcademicSemesterDto } from "./find.academic-semester.dto";
import { SystemError } from "src/application/services/@shared/system-error";

export class FindAcademicSemesterService {

    private semesterRepository: AcademicSemesterInterface;

    constructor(semesterRepository: AcademicSemesterInterface){
        this.semesterRepository = semesterRepository;
    }

    async execute(id: string): Promise<FindAcademicSemesterDto>{
        try {
            let semester = await this.semesterRepository.find(id);
            if (!semester) {
                throw new SystemError([{context: 'academicSemester', message: 'Academic Semester not found'}]);
            }
            const firstQuarter = semester.quarters[0].quarterNumber === 1 ? semester.quarters[0] : semester.quarters[1];
            const secondQuarter = semester.quarters[0].quarterNumber === 2 ? semester.quarters[0] : semester.quarters[1];
            let dto = new FindAcademicSemesterDto({id: semester.id, current: semester.current, firstQuarter: firstQuarter, secondQuarter: secondQuarter});
            return dto;
        } catch (error) {
            throw error;
        }
    }
}