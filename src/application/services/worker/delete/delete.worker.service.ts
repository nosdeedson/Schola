import { DeleteGenericService } from "src/application/services/@shared/delete-generic-service";
import { WorkerRepositoryInterface } from "@/domain/worker/worker.repository.interface";

export class DeleteWorkerService extends DeleteGenericService{

    private workerRepository: WorkerRepositoryInterface;

    constructor(workerRepository: WorkerRepositoryInterface) {
        super();
        this.workerRepository = workerRepository;
    }

    async execute(id: string) {
        this.workerRepository.delete(id);
    }
}