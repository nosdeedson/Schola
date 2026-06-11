import { PeronRepositoryInterface } from '../@shared/repository/person.repository.interface';
import { Worker } from './worker'
export interface WorkerRepositoryInterface extends PeronRepositoryInterface<Worker> {
    findByName(name: string): Promise<Worker>;
 }