import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { FindWorkerDto } from "../find/find.worker.dto";
import { OutputFindAllWorkerDto } from "./list.worker.dto";
import { Worker } from "@/domain/worker/worker";

export class FindAllWorkerService {

    private workerRepository: WorkerRepositoryInterface;

    constructor(workerRepository: WorkerRepositoryInterface) {
        this.workerRepository = workerRepository;
    }

    public async execute(): Promise<OutputFindAllWorkerDto> {
        let workers = await this.workerRepository.findAll() as unknown as Worker[];
        let results: OutputFindAllWorkerDto = { all: [] };
        workers.forEach(it => {
            const worker: FindWorkerDto = {
                birthday: it.getBirthday(),
                createdAt: it.getCreatedAt(),
                id: it.getId(),
                name: it.getName(),
                role: it.getRole(),
                udpatedAt: it.getUpdatedAt()
            }
            results.all.push(worker)
        });
        return results;
    }
}
