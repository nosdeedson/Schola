import { Injectable } from "@nestjs/common";
import { SystemError } from "src/application/services/@shared/system-error";
import { UpdateClassDto } from "src/application/services/class/update/udpate.class.dto";
import { UpdateClassService } from "src/application/services/class/update/update.class.service";
import { ClassRepositoryInterface } from "src/domain/class/class.repository.interface";
import { WorkerRepositoryInterface } from "src/domain/worker/worker.repository.interface";
import { UpdateSchoolgroupRequestDto } from "src/infrastructure/api/controllers/schoolgroup/dto/update/update-schoolgroup-request-dto";
import { RepositoryFactoryService } from "src/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "src/infrastructure/factory/repositiry-factory/type-repository";
import { ClassRepository } from "src/infrastructure/repositories/class/class.repository";
import { TrataErros } from "src/infrastructure/utils/trata-erros/trata-erros";
import { UpdateSchoolgroupUsecaseDto } from "./update-schoolgroup-usecase.dto";

@Injectable()
export class UpdateSchoolgroupUsecase {
    private classRepository: ClassRepositoryInterface;
    private teacherReposittory: WorkerRepositoryInterface;

    constructor(
        private repositoryFactory: RepositoryFactoryService
    ) {
        this.classRepository = this.repositoryFactory.createRepository(TypeRepository.CLASS) as ClassRepository;
        this.teacherReposittory = this.repositoryFactory.createRepository(TypeRepository.WORKER);
    }

    async update(dto: UpdateSchoolgroupUsecaseDto): Promise<void> {
        try {
            const teacher = await this.teacherReposittory.findByName(dto.teacherName);
            if (!teacher) throw new SystemError([{ context: 'teacher', message: 'teacher not found' }]);
            let input = dto.toInput(teacher);
            let updateService = new UpdateClassService(this.classRepository);
            await updateService.execute(input);
        } catch (error) {
            TrataErros.tratarErrorsNotFound(error);
        }
    }
}