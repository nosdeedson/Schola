import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { OutputFindWorkerDto } from "./find.worker.dto";
import { FindGenericService } from "@/application/services/@shared/find-generic-service";
import { SystemError } from "@/application/services/@shared/system-error";

export class FindWorkerService extends FindGenericService {
    private workerRepository: WorkerRepositoryInterface;

    constructor(workerRepository: WorkerRepositoryInterface) {
        super();
        this.workerRepository = workerRepository;
    }

    public async execute(id: string): Promise<OutputFindWorkerDto> {
        let worker = await this.workerRepository.find(id) as WorkerEntity;
        if (!worker) {
            throw new SystemError([{ context: "find user", message: "Failed to find the user" }]);
        }
        let output = {} as OutputFindWorkerDto;
        output = {
            birthday: worker.birthday,
            name: worker.fullName,
            createdAt: worker.createdAt,
            id: worker.id,
            role: worker.role,
            udpatedAt: worker.updatedAt
        };
        return output;
    }
}
