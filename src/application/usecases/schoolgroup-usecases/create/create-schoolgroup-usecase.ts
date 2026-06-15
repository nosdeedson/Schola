import { SystemError } from "@/application/services/@shared/system-error";
import { CreateClassService } from "@/application/services/class/create/create.class.service";
import { CreateWorkerDto } from "@/application/services/worker/create/create.worker.dto";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { AccessType } from "@/domain/user/access.type";
import { WorkerRepositoryInterface } from "@/domain/worker/worker.repository.interface";
import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";
import { CreateSchoolgroupUseCaseDto } from "./dto/create-schoolgroup-usecase.dto";
import { CreateGetWorkerService } from "@/application/services/worker/create-or-get-worker/create-get-worker.service";
import { Worker } from "@/domain/worker/worker";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";

export class CreateSchoolgroupUseCase {

    constructor(
        private classRepository: ClassRepositoryInterface,
        private workerReposittory: WorkerRepositoryInterface,
    ) { }

    async execute(dto: CreateSchoolgroupUseCaseDto): Promise<void> {
        try {
            const teacherService = new CreateGetWorkerService(this.workerReposittory);
            const teacherDto = new CreateWorkerDto({
                name: dto.teacherName,
                accessType: AccessType.TEACHER,
                classCode: null,
            })
            const teacher = await teacherService.execute(teacherDto) as Worker;
            let createService = new CreateClassService(this.classRepository);
            let input = dto.toCreateClassDto(WorkerMapper.fromDomain(teacher));
            await createService.execute(input);
        } catch (error) {
            ExceptionHandler.exceptionHandler(error as SystemError);
        }
    }
}
