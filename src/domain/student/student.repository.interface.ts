import { StudentEntity } from '@/infrastructure/entities/student/student.entity';
import { PeronRepositoryInterface } from '../@shared/repository/person.repository.interface';
import { Student } from './student';


export interface StudentRepositoryInterface extends PeronRepositoryInterface<StudentEntity> {
    findStudentByNameAndParentNames(studentName: string, parentNames: string[]): Promise<Student>;
    updateAll(students: StudentEntity[]): Promise<void>;
    findByIds(studentIds: string[]): Promise<Student[]>;
}
