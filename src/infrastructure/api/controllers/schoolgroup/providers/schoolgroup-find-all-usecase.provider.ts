import { FindAllSchoolgroupUsecase } from "@/application/usecases/schoolgroup-usecases/findall/find-all-schoolgroup-usecase";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { CLASS_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const schoolgroupFindAllUsecaseProvider = [
    {
        provide: FindAllSchoolgroupUsecase,
        useFactory: (classRepo: ClassRepository) => new FindAllSchoolgroupUsecase(classRepo),
        inject: [CLASS_REPOSITORY]
    }
]