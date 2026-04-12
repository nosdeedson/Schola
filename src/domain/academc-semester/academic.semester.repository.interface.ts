import { AcademicSemesterEntity } from '../../infrastructure/entities/academic-semester/academic.semester.entity'
import { RepositoryInterface } from '../@shared/repository/repository.interface'

export interface AcademicSemesterRespositoryInterface extends RepositoryInterface<AcademicSemesterEntity> {
    findCurrentSemester(): Promise<AcademicSemesterEntity>;
}
