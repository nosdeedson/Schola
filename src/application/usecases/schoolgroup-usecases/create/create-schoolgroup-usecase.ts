import { SystemError } from "@/application/services/@shared/system-error";
import { CreateClassService } from "@/application/services/class/create/create.class.service";
import { CreateWorkerDto } from "@/application/services/worker/create/create.worker.dto";
import { CreateWorkerService } from "@/application/services/worker/create/create.worker.service";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { AccessType } from "@/domain/user/access.type";
import { WorkerRepositoryInterface } from "@/domain/worker/worker.repository.interface";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { Injectable } from "@nestjs/common";
import { CreateSchoolgroupUseCaseDto } from "./dto/create-schoolgroup-usecase.dto";


@Injectable()
export class CreateSchoolgroupUseCase {
    private classRepository: ClassRepositoryInterface;
    private teacherReposittory: WorkerRepositoryInterface;

    constructor(
        private repositoryFactory: RepositoryFactoryService
    ) {
        this.classRepository = this.repositoryFactory.createRepository(TypeRepository.CLASS) as ClassRepository;
        this.teacherReposittory = this.repositoryFactory.createRepository(TypeRepository.WORKER);
    }

    async create(dto: CreateSchoolgroupUseCaseDto): Promise<void> {
        try {
            const teacherService = new CreateWorkerService(this.teacherReposittory, this.classRepository);
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