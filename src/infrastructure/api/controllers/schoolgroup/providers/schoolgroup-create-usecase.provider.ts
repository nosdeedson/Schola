import { CreateSchoolgroupUseCase } from "@/application/usecases/schoolgroup-usecases/create/create-schoolgroup-usecase";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { WorkerRepository } from "@/infrastructure/repositories/worker/worker.repository";
import { CLASS_REPOSITORY, WORKER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const schoolgroupCreateUseCaseProvider = [
    {
        provide: CreateSchoolgroupUseCase,
        useFactory: (
            classRepo: ClassRepository,
            workerRepo: WorkerRepository,
        ) => {
            return new CreateSchoolgroupUseCase(
                classRepo, workerRepo
            );
        },
        inject: [CLASS_REPOSITORY, WORKER_REPOSITORY]
    }
]
