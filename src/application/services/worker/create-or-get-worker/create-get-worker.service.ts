import { WorkerRepositoryInterface } from "@/domain/worker/worker.repository.interface";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { CreateWorkerDto } from "../create/create.worker.dto";
import { Worker } from "@/domain/worker/worker";
import { SystemError } from "../../@shared/system-error";

export class CreateGetWorkerService {
    private workerRepository: WorkerRepositoryInterface;

    constructor(
        workerRepository: WorkerRepositoryInterface,
    ) {
        this.workerRepository = workerRepository;
    }

    async execute(input: CreateWorkerDto): Promise<WorkerEntity> {
        try {
            const workerExist = await this.workerRepository.findByName(input.name);
            if (workerExist) return workerExist;
            let worker = new Worker({ birthday: input.birthday, name: input.name, role: input.role });
            if (worker.notification?.hasError()) {
                throw new SystemError(worker.notification.getErrors());
            }
            let model = WorkerEntity.toWorkerEntity(worker);
            return await this.workerRepository.create(model) as WorkerEntity;
        } catch (error) {
            throw error;
        }
    }
}
