import { Inject, Injectable } from '@nestjs/common';
import { CreateClassService } from 'src/application/services/class/create/create.class.service';
import { DeleteClassService } from 'src/application/services/class/delete/delete.class.service';
import { FindClassService } from 'src/application/services/class/find/find.class.service';
import { FindAllClassService } from 'src/application/services/class/findAll/findAll.class.service';
import { UpdateClassService } from 'src/application/services/class/update/update.class.service';
import { ClassEntity } from 'src/infrastructure/entities/class/class.entity';
import { ClassRepository } from 'src/infrastructure/repositories/class/class.repository';
import { TrataErros } from 'src/infrastructure/utils/trata-erros/trata-erros';
import { DataSource } from 'typeorm';
import { CreateSchoolgroupDto } from '../../../infrastructure/api/controllers/schoolgroup/dto/create/create-schoolgroup-dto';
import { UpdateSchoolgroupDto } from '../../../infrastructure/api/controllers/schoolgroup/dto/update/update-schoolgroup-dto';
import { RepositoryFactoryService } from 'src/infrastructure/factory/repositiry-factory/repository-factory.service';
import { TypeRepository } from 'src/infrastructure/factory/repositiry-factory/type-repository';
import { WorkerRepository } from 'src/infrastructure/repositories/worker/worker.repository';
import { ClassRepositoryInterface } from 'src/domain/class/class.repository.interface';
import { WorkerRepositoryInterface } from 'src/domain/worker/worker.repository.interface';
import { CreateWorkerService } from 'src/application/services/worker/create/create.worker.service';
import { CreateWorkerDto } from 'src/application/services/worker/create/create.worker.dto';
import { AccessType } from 'src/domain/user/access.type';
import { WorkerEntity } from 'src/infrastructure/entities/worker/worker.entity';
import { SystemError } from 'src/application/services/@shared/system-error';

@Injectable()
export class SchoolgroupUseCases {

    private classRepository: ClassRepositoryInterface;
    private teacherReposittory: WorkerRepositoryInterface;

    constructor(
        private repositoryFactory: RepositoryFactoryService
    ) {
        this.classRepository = this.repositoryFactory.createRepository(TypeRepository.CLASS) as ClassRepository;
        this.teacherReposittory = this.repositoryFactory.createRepository(TypeRepository.WORKER);
    }

    async delete(id: string): Promise<void>{
        let deleteService = new DeleteClassService(this.classRepository);
        deleteService.execute(id);
    }

    async find(id: string): Promise<any> {
        try {
            let findService = new FindClassService(this.classRepository);
            return await findService.execute(id);
        } catch (error) {
            TrataErros.tratarErrorsNotFound(error);
        }
    }

    async findAll(): Promise<any>{
        let allService = new FindAllClassService(this.classRepository);
        let result =  await allService.execute();
        return result;
    }

}
