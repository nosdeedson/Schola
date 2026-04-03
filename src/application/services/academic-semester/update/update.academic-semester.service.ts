import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { UpdateAcademicSemesterDto } from "./udpate.academic-semester.dto";
import { AcademicSemesterInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { SystemError } from "../../@shared/system-error";

export class UpdateAcademicSemesterService{

    private semesterRepository: AcademicSemesterInterface;

    constructor(semesterRepository: AcademicSemesterInterface){
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
            } else {
                throw new SystemError([{context: 'semester', message: 'semester not found'}]);
            }
        } catch (error) {
            throw error;
        }
    }

}