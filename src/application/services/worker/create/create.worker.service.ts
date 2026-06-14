import { WorkerMapper } from '@/infrastructure/mappers/worker/worker-mapper';
import { ClassRepositoryInterface } from '../../../../domain/class/class.repository.interface';
import { Worker } from '../../../../domain/worker/worker';
import { WorkerRepositoryInterface } from '../../../../domain/worker/worker.repository.interface';
import { WorkerEntity } from '../../../../infrastructure/entities/worker/worker.entity';
import { CreateGenericService } from '../../@shared/create-generic-service';
import { SystemError } from '../../@shared/system-error';
import { CreateWorkerDto } from './create.worker.dto';


export class CreateWorkerService extends CreateGenericService {

    private workerRepository: WorkerRepositoryInterface

    constructor(
        workerRepository: WorkerRepositoryInterface,
    ) {
        super(workerRepository);
        this.workerRepository = workerRepository;
    }

    public async execute(input: CreateWorkerDto): Promise<Worker> {
        try {
            const teacherExist = await this.workerRepository.findByName(input.name);
            if (teacherExist) {
                teacherExist.setBirthDay(new Date(input.birthday));
                teacherExist.setUpdatedAt(new Date());
                return await this.workerRepository.create(WorkerMapper.fromDomain(teacherExist)) as Worker;
            }
            let worker = new Worker({ birthday: input.birthday, name: input.name, role: input.role });
            if (worker.notification?.hasError()) {
                throw new SystemError(worker.notification.getErrors(), 422);
            }
            let model = WorkerMapper.fromDomain(worker);
            return await this.workerRepository.create(model) as Worker;
        } catch (error) {
            throw error;
        }
    }
}
