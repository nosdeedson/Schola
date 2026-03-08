import { Injectable } from "@nestjs/common";
import { CreateClassService } from "src/application/services/class/create/create.class.service";
import { CreateWorkerDto } from "src/application/services/worker/create/create.worker.dto";
import { CreateWorkerService } from "src/application/services/worker/create/create.worker.service";
import { ClassRepositoryInterface } from "src/domain/class/class.repository.interface";
import { AccessType } from "src/domain/user/access.type";
import { WorkerRepositoryInterface } from "src/domain/worker/worker.repository.interface";
import { CreateSchoolgroupDto } from "src/infrastructure/api/controllers/schoolgroup/dto/create/create-schoolgroup-dto";
import { WorkerEntity } from "src/infrastructure/entities/worker/worker.entity";
import { RepositoryFactoryService } from "src/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "src/infrastructure/factory/repositiry-factory/type-repository";
import { ClassRepository } from "src/infrastructure/repositories/class/class.repository";
import { TrataErros } from "src/infrastructure/utils/trata-erros/trata-erros";

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

    async create(dto: CreateSchoolgroupDto): Promise<void> {
        try {
            const teacherService = new CreateWorkerService(this.teacherReposittory, this.classRepository);
            const teacherDto = new CreateWorkerDto({
                name: dto.teacherName,
                accessType: AccessType.TEACHER,
                classCode: null,
            })
            const teacher = await teacherService.execute(teacherDto) as WorkerEntity;
            let createService = new CreateClassService(this.classRepository);
            let input = dto.toInput(teacher);
            await createService.execute(input);
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error);
        }
    }
}