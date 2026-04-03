import { ClassRepositoryInterface } from '@/domain/class/class.repository.interface';
import { WorkerRepositoryInterface } from '@/domain/worker/worker.repository.interface';
import { RepositoryFactoryService } from '@/infrastructure/factory/repositiry-factory/repository-factory.service';
import { TypeRepository } from '@/infrastructure/factory/repositiry-factory/type-repository';
import { ClassRepository } from '@/infrastructure/repositories/class/class.repository';
import { TrataErros } from '@/infrastructure/utils/trata-erros/trata-erros';
import { Injectable } from '@nestjs/common';
import { DeleteClassService } from '@/application/services/class/delete/delete.class.service';
import { FindClassService } from '@/application/services/class/find/find.class.service';
import { FindAllClassService } from '@/application/services/class/findAll/findAll.class.service';
import { SystemError } from '@/application/services/@shared/system-error';

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
            TrataErros.tratarErrorsNotFound(error as SystemError);
        }
    }

    async findAll(): Promise<any>{
        let allService = new FindAllClassService(this.classRepository);
        let result =  await allService.execute();
        return result;
    }

}
