import { AcademicSemesterInterface } from "@/domain/academc-semester/academic.semester.repository.interface";

export class DeleteAcademicSemesterService{

    private semesterRepository : AcademicSemesterInterface;

    constructor(semesterRepository: AcademicSemesterInterface){
        this.semesterRepository = semesterRepository;
    }

    async execute(id: string) {
        try {
            await this.semesterRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }
}