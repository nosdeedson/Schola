import { SystemError } from "@/application/services/@shared/system-error";
import { FindClassDto } from "@/application/services/class/find/find.class.dto";
import { FindClassService } from "@/application/services/class/find/find.class.service";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";

export class FindSchoolgroupUsecase {

    constructor(private classRepository: ClassRepositoryInterface) { }

    async execute(classId: string): Promise<FindClassDto> {
        try {
            let findService = new FindClassService(this.classRepository);
            return await findService.execute(classId);
        } catch (error) {
            TrataErros.tratarErrorsNotFound(error as SystemError);
        }
    }
}
