import { AcademicSemesterRepository } from "@/infrastructure/repositories/academic-semester/academic-semester.repository";
import { UpdateAcademicSemesterDto } from "./udpate.academic-semester.dto";
import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { SystemError } from "../../@shared/system-error";
import { AcademicSemesterMapper } from "@/infrastructure/mappers/semester/academic-semester-mapper";

export class UpdateAcademicSemesterService {

    private semesterRepository: AcademicSemesterRespositoryInterface;

    constructor(semesterRepository: AcademicSemesterRespositoryInterface) {
        this.semesterRepository = semesterRepository;
    }

    async execute(dto: UpdateAcademicSemesterDto) {
        try {
            let semester = await this.semesterRepository.find(dto.id);
            if (semester) {
                if (dto.updatingQuarter) {
                    semester.getFirstQuarter().currentQuarter = false;
                    semester.getSecondQuarter().currentQuarter = true;
                    semester.setUpdatedAt(new Date());
                } else if (dto.updatingSemester) {
                    semester.getFirstQuarter().currentQuarter = false;
                    semester.getSecondQuarter().currentQuarter = false;
                    semester.setCurrentSemester(false);
                    semester.setDeletedAt(new Date());
                    semester.setUpdatedAt(new Date());
                }
                await this.semesterRepository.update(AcademicSemesterMapper.fromDomain(semester));
            } else {
                throw new SystemError([
                    { context: 'semester', message: 'semester not found' }],
                    404
                );
            }
        } catch (error) {
            throw error;
        }
    }

}
