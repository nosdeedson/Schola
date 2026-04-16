import { DeleteSchoolgroupUsecase } from "@/application/usecases/schoolgroup-usecases/delete/delete-schoolgroup-usecase";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { CLASS_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const schoolgroupDeleteProvider = [
    {
        provide: DeleteSchoolgroupUsecase,
        useFactory: (
            classRepo: ClassRepository
        ) => {
            return new DeleteSchoolgroupUsecase(classRepo);
        },
        inject: [CLASS_REPOSITORY]
    }
]