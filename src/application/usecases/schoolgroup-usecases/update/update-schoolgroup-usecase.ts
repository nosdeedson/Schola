import { UpdateSchoolgroupUsecaseDto } from "./update-schoolgroup-usecase.dto";
import { SystemError } from "@/application/services/@shared/system-error";
import { UpdateClassService } from "@/application/services/class/update/update.class.service";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { WorkerRepositoryInterface } from "@/domain/worker/worker.repository.interface";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";

export class UpdateSchoolgroupUsecase {

    constructor(
        private classRepository: ClassRepositoryInterface,
        private teacherReposittory: WorkerRepositoryInterface,
    ) { }

    async update(dto: UpdateSchoolgroupUsecaseDto): Promise<void> {
        try {
            const teacher = await this.teacherReposittory.findByName(dto.teacherName);
            if (!teacher) throw new SystemError([{ context: 'teacher', message: 'teacher not found' }]);
            let input = dto.toInput(teacher);
            let updateService = new UpdateClassService(this.classRepository);
            await updateService.execute(input);
        } catch (error) {
            TrataErros.tratarErrorsNotFound(error as SystemError);
        }
    }
}
