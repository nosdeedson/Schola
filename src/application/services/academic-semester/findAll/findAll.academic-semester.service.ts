import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { FindAllAcademicSemesterDto } from "./findAll.academic-semester.dto";

export class FindAllAcademicSemesterService {

    private semesterRepository: AcademicSemesterRepository;

    constructor(semesterRepository: AcademicSemesterRepository) {
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