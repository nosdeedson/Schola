import { StudentEntity } from '@/infrastructure/entities/student/student.entity';
import { PeronRepositoryInterface } from '../@shared/repository/person.repository.interface';


export interface StudentRepositoryInterface extends PeronRepositoryInterface<StudentEntity> {
    findStudentByNameAndParentNames(studentName: string, parentNames: string[]): Promise<StudentEntity>;
 }