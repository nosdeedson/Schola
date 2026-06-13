import { ParentEntity } from '@/infrastructure/entities/parent/parent.entity';
import { PeronRepositoryInterface } from '../@shared/repository/person.repository.interface';
import { Parent } from './parent';


export interface ParentReporitoryInterface extends PeronRepositoryInterface<ParentEntity> {
    findByParentNameAndStudentNames(parentName: string, studentNames: string[]): Promise<Parent>;
}
