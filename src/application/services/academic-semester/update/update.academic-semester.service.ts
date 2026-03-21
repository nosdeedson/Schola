import { AcademicSemesterRepository } from "src/infrastructure/repositories/academic-semester/academic-semester.repository";
import { UpdateAcademicSemesterDto } from "./udpate.academic-semester.dto";

export class UpdateAcademicSemesterService{

    private semesterRepository: AcademicSemesterRepository;

    constructor(semesterRepository: AcademicSemesterRepository){
        this.semesterRepository = semesterRepository;
    }

    async execute(dto: UpdateAcademicSemesterDto) {
        try {
            let entity = await this.semesterRepository.find(dto.id);
            if(entity){
                if(dto.updatingQuarter) {
                    entity.quarters[0].quarterNumber == 1 ? entity.quarters[0].currentQuarter = false : entity.quarters[1].currentQuarter = false;
                    entity.quarters[1].quarterNumber == 2 ? entity.quarters[1].currentQuarter = true : entity.quarters[0].currentQuarter = false;
                    entity.updatedAt = new Date();
                } else if (dto.updatingSemester) {
                    entity.quarters[1].currentQuarter = false;
                    entity.quarters[0].currentQuarter = false;
                    entity.current = false;
                    entity.deletedAt = new Date();
                    entity.updatedAt = new Date();
                }
                await this.semesterRepository.update(entity);
            }
        } catch (error) {
            throw error;
        }
    }

}