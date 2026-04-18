import { FindAllAcademicSemesterDto } from "./findAll.academic-semester.dto";
import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";

export class FindAllAcademicSemesterService {

    private semesterRepository: AcademicSemesterRespositoryInterface;

    constructor(semesterRepository: AcademicSemesterRespositoryInterface) {
        this.semesterRepository = semesterRepository;
    }

    async execute(): Promise<FindAllAcademicSemesterDto> {
        try {
            let entities = await this.semesterRepository.findAll();
            let dtos = new FindAllAcademicSemesterDto(entities);
            return dtos
        } catch (error) {
            throw error;
        }
    }
}
