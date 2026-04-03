import { ParentEntity } from '@/infrastructure/entities/parent/parent.entity';
import { PeronRepositoryInterface } from '../@shared/repository/person.repository.interface';


export interface ParentReporitoryInterface extends PeronRepositoryInterface<ParentEntity> {
    findByParentNameAndStudentNames(parentName: string, studentNames: string[]): Promise<ParentEntity>;
 }
