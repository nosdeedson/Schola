import { CreateSchoolgroupUseCase } from "@/application/usecases/schoolgroup-usecases/create/create-schoolgroup-usecase";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { WorkerRepository } from "@/infrastructure/repositories/worker/worker.repository";
import { CLASS_REPOSITORY, WORKER_REPOSITORY } from "../../controller-tokens/controller-tokens";
import { TransactionService } from "@/infrastructure/transaction-service/transaction-service";

export const schoolgroupCreateUseCaseProvider = [
    {
        provide: CreateSchoolgroupUseCase,
        useFactory: (
            classRepo: ClassRepository,
            workerRepo: WorkerRepository,
            transactionService: TransactionService,
        ) => {
            return new CreateSchoolgroupUseCase(
                classRepo, workerRepo, transactionService
            );
        },
        inject: [CLASS_REPOSITORY, WORKER_REPOSITORY]
    }
]
