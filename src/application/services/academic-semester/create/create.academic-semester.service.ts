import { AcademicSemester } from '@/domain/academc-semester/academic.semester';
import { AcademicSemesterRespositoryInterface } from '../../../../domain/academc-semester/academic.semester.repository.interface';
import { CreateAcademicSemesterUsecaseDto } from './semester/create-academic-semester-usecase.dto';
import { AcademicSemesterEntity } from '@/infrastructure/entities/academic-semester/academic.semester.entity';
import { SystemError } from '@/application/services/@shared/system-error';


export class CreateAcademicSemesterService {
    private semesterRepository: AcademicSemesterRespositoryInterface;

    constructor(semesterRespository: AcademicSemesterRespositoryInterface) {
        this.semesterRepository = semesterRespository;
    }

    public async execute(input: CreateAcademicSemesterUsecaseDto): Promise<void> {
        try {
            let semester = new AcademicSemester(input.firstQuarter.toDomain(), input.secondQuarter.toDomain(), input.currentSemester);
            if (semester.notification?.hasError()) {
                let errors = semester.notification?.getErrors();
                throw new SystemError(errors);
            }
            let model = AcademicSemesterEntity.toEntity(semester);
            await this.semesterRepository.create(model);
        } catch (error) {
            throw error;
        }
    }

}
