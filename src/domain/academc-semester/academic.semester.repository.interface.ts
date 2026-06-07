import { AcademicSemesterEntity } from '@/infrastructure/entities/academic-semester/academic.semester.entity';
import { RepositoryInterface } from '../@shared/repository/repository.interface'
import { AcademicSemester } from './academic.semester';

export interface AcademicSemesterRespositoryInterface extends RepositoryInterface<AcademicSemesterEntity, AcademicSemester> {
    findCurrentSemester(): Promise<AcademicSemester>;
}
