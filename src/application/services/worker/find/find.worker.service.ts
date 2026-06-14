import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { FindWorkerDto } from "./find.worker.dto";
import { FindGenericService } from "@/application/services/@shared/find-generic-service";
import { SystemError } from "@/application/services/@shared/system-error";
import { Worker } from "@/domain/worker/worker";

export class FindWorkerService extends FindGenericService {
    private workerRepository: WorkerRepositoryInterface;

    constructor(workerRepository: WorkerRepositoryInterface) {
        super();
        this.workerRepository = workerRepository;
    }

    public async execute(id: string): Promise<FindWorkerDto> {
        let worker = await this.workerRepository.find(id) as Worker;
        if (!worker) {
            throw new SystemError([{ context: "find user", message: "Failed to find the user" }], 404);
        }
        let output = {} as FindWorkerDto;
        output = {
            birthday: worker.getBirthday(),
            name: worker.getName(),
            createdAt: worker.getCreatedAt(),
            id: worker.getId(),
            role: worker.getRole(),
            udpatedAt: worker.getUpdatedAt()
        };
        return output;
    }
}
