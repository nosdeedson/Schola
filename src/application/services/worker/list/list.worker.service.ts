import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { WorkerRepositoryInterface } from "../../../../domain/worker/worker.repository.interface";
import { FindWorkerDto } from "../find/find.worker.dto";
import { OutputFindAllWorkerDto } from "./list.worker.dto";

export class FindAllWorkerService {

    private workerRepository: WorkerRepositoryInterface;

    constructor(workerRepository: WorkerRepositoryInterface) {
        this.workerRepository = workerRepository;
    }

    public async execute(): Promise<OutputFindAllWorkerDto> {
        let workers = await this.workerRepository.findAll();
        
        let results : OutputFindAllWorkerDto =  { 
            all: workers.map((it: WorkerEntity) =>{
                let output: FindWorkerDto = {
                    birthday: it.birthday,
                    createdAt: it.createdAt,
                    id: it.id,
                    name: it.fullName,
                    role: it.role,
                    udpatedAt: it.updatedAt
                } 
                return output;
            })
        };

        return results;
    }
}