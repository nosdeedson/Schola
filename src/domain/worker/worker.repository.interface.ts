import { WorkerEntity } from '../../infrastructure/entities/worker/worker.entity';
import { PeronRepositoryInterface } from '../@shared/repository/person.repository.interface';

export interface WorkerRepositoryInterface extends PeronRepositoryInterface<WorkerEntity> {
    findByName(name: string): Promise<WorkerEntity>;
 }