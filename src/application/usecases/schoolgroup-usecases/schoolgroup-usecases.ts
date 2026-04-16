import { ClassRepositoryInterface } from '@/domain/class/class.repository.interface';
import { TrataErros } from '@/infrastructure/utils/trata-erros/trata-erros';
import { DeleteClassService } from '@/application/services/class/delete/delete.class.service';
import { FindClassService } from '@/application/services/class/find/find.class.service';
import { FindAllClassService } from '@/application/services/class/findAll/findAll.class.service';
import { SystemError } from '@/application/services/@shared/system-error';

export class SchoolgroupUseCases {

    constructor(
        private classRepository: ClassRepositoryInterface,
    ) { }

    async findAll(): Promise<any> {
        let allService = new FindAllClassService(this.classRepository);
        let result = await allService.execute();
        return result;
    }

}
