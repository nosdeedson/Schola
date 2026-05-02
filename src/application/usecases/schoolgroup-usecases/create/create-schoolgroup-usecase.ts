import { SystemError } from "@/application/services/@shared/system-error";
import { CreateClassService } from "@/application/services/class/create/create.class.service";
import { CreateWorkerDto } from "@/application/services/worker/create/create.worker.dto";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { AccessType } from "@/domain/user/access.type";
import { WorkerRepositoryInterface } from "@/domain/worker/worker.repository.interface";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { CreateSchoolgroupUseCaseDto } from "./dto/create-schoolgroup-usecase.dto";
import { CreateGetWorkerService } from "@/application/services/worker/create-or-get-worker/create-get-worker.service";

export class CreateSchoolgroupUseCase {

    constructor(
        private classRepository: ClassRepositoryInterface,
        private workerReposittory: WorkerRepositoryInterface,
    ) { }

    async create(dto: CreateSchoolgroupUseCaseDto): Promise<void> {
        try {
            const teacherService = new CreateGetWorkerService(this.workerReposittory);
            const teacherDto = new CreateWorkerDto({
                name: dto.teacherName,
                accessType: AccessType.TEACHER,
                classCode: null,
            })
            const teacher = await teacherService.execute(teacherDto) as WorkerEntity;
            let createService = new CreateClassService(this.classRepository);
            let input = dto.toCreateClassDto(teacher);
            await createService.execute(input);
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error as SystemError);
        }
    }
}
