import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { InputUpdateWorkerDto } from "./update.worker.dto";
import { Worker } from "@/domain/worker/worker";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { SystemError } from "../../@shared/system-error";

export class UpdateWorkerService {

    private workerRepository: WorkerRepositoryInterface;

    constructor(workerRepository: WorkerRepositoryInterface) {
        this.workerRepository = workerRepository;
    }

    public async execute(dto: InputUpdateWorkerDto) {
        let worker = await this.workerRepository.find(dto.id) as Worker;
        if (worker) {
            worker = this.update(worker, dto);
            if (worker.notification.hasError()) {
                throw new SystemError([{
                    context: 'worker', message: worker.notification.messages()
                }], 422);
            }
            this.workerRepository.update(WorkerMapper.fromDomain(worker));
        }
    }

    private update(worker: Worker, dto: InputUpdateWorkerDto): Worker {
        worker.setName(dto.name);
        worker.setRole(dto.role);
        worker.validate();
        return worker;
    }
}
