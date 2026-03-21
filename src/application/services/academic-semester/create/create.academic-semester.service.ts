import { AcademicSemester } from 'src/domain/academc-semester/academic.semester';
import { AcademicSemesterInterface } from '../../../../domain/academc-semester/academic.semester.repository.interface';
import { CreateAcademicSemesterDto } from './semester/academic-semester.dto';
import { AcademicSemesterEntity } from 'src/infrastructure/entities/academic-semester/academic.semester.entity';
import { SystemError } from 'src/application/services/@shared/system-error';


export class CreateAcademicSemesterService {
    private semesterRepository: AcademicSemesterInterface;

    constructor(semesterRespository: AcademicSemesterInterface){
        this.semesterRepository = semesterRespository;
    }

    public async execute(input: CreateAcademicSemesterDto): Promise<void>{
        try {
            let semester = new AcademicSemester(input.firstQuarter.toDomain(), input.secondQuarter.toDomain(), input.currentSemester );
            if(semester.notification?.hasError()){
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