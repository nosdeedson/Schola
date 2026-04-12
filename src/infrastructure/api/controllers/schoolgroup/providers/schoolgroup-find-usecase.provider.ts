import { FindSchoolgroupUsecase } from "@/application/usecases/schoolgroup-usecases/find/find-schoolgroup-usecase";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { Inject } from "@nestjs/common";
import { CLASS_REPOSITORY } from "../../controller-tokens/controller-tokens";


export const schoolgroupFindUsecaseProvider = [
    {
        provide: FindSchoolgroupUsecase,
        useFactory: (
            classRepo: ClassRepository,
        ) => {
            return new FindSchoolgroupUsecase(classRepo);
        },
        inject: [CLASS_REPOSITORY]
    }
]
