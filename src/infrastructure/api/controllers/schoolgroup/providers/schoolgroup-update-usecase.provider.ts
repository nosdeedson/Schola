import { UpdateSchoolgroupUsecase } from "@/application/usecases/schoolgroup-usecases/update/update-schoolgroup-usecase";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { WorkerRepository } from "@/infrastructure/repositories/worker/worker.repository";
import { CLASS_REPOSITORY, WORKER_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const schoolgroupUpdateUsecaseProvider = [
    {
        provide: UpdateSchoolgroupUsecase,
        useFactory: (
            classRepo: ClassRepository,
            workerRepo: WorkerRepository,
        ) => {
            return new UpdateSchoolgroupUsecase(
                classRepo, workerRepo
            );
        },
        inject: [CLASS_REPOSITORY, WORKER_REPOSITORY]
    }
]
