import { WorkerRepository } from "@/infrastructure/repositories/worker/worker.repository";
import { Provider } from "@nestjs/common";
import { CLASS_REPOSITORY, WORKER_REPOSITORY } from "../../controller-tokens/controller-tokens";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";

export const schoolgroupRepositoriesProviders: Provider[] = [
    {
        provide: WORKER_REPOSITORY,
        useClass: WorkerRepository
    },
    {
        provide: CLASS_REPOSITORY,
        useClass: ClassRepository,
    }
]
