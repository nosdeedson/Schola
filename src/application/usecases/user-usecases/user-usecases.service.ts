import { Injectable } from '@nestjs/common';
import { DeleteUserService } from '@/application/services/user/delete/delete.user.service';
import { FindUserService } from '@/application/services/user/find/find.user.service';
import { CreateUserFactoryService } from '@/infrastructure/factory/create-user-service-factory/create-user-factory-service';
import { DeleteUserFactoryService } from '@/infrastructure/factory/delete-user-factory/delete-user-factory.service';
import { RepositoryFactoryService } from '@/infrastructure/factory/repositiry-factory/repository-factory.service';
import { TypeRepository } from '@/infrastructure/factory/repositiry-factory/type-repository';
import { UserRepository } from '@/infrastructure/repositories/user/user.repository';
import { TrataErros } from '@/infrastructure/utils/trata-erros/trata-erros';
import { FindUserOutPutDto } from '../../../infrastructure/api/controllers/users/dtos/find-user-dto/find-user-outPut-dto';
import { FindUserFactoryService } from '@/infrastructure/factory/find-user-factory/find-user-factory.service';
import { SystemError } from '@/application/services/@shared/system-error';

@Injectable()
export class UserUsecasesService {
    private userRepository: UserRepository;

    constructor(
        private userServiceFactory: CreateUserFactoryService,
        private userDeleteFactory: DeleteUserFactoryService,
        private userFindFactory: FindUserFactoryService,
        private repositoryFactory: RepositoryFactoryService
    ) {
        this.userRepository = this.repositoryFactory.createRepository(TypeRepository.USER) as UserRepository;
    }

    async delete(id: string): Promise<void> {
        try {
            let userFindService = new FindUserService(this.userRepository);
            let userToDelete = await userFindService.execute(id);
            let deletePerson = await this.userDeleteFactory.deleteUserServiceFactory(userToDelete.accessType);
            await deletePerson.execute(userToDelete.personId);
            let deleteUserService = new DeleteUserService(this.userRepository);
            await deleteUserService.execute(id);
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error as SystemError);
        }
    }

    async find(id: string): Promise<FindUserOutPutDto> {
        try {
            let findUserService = new FindUserService(this.userRepository);
            let user = await findUserService.execute(id);
            let findPersonService = await this.userFindFactory.findUserServiceFactory(user.accessType);
            let person = await findPersonService.execute(user.personId);
            return new FindUserOutPutDto(user, person.name);
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error as SystemError);
        }
    }

    async findAll(): Promise<FindUserOutPutDto[]> {
        // let findAllUserService = new FindAllUserService(this.userRepository);
        // const users = await findAllUserService.execute();
        // const usersOutput = [];
        // for (const user of users.all) {
        //     let person = await this.workerRepository.find(user.personId);
        //     usersOutput.push(new FindUserOutPutDto(user, person.name));
        // }
        // return usersOutput;
        return null;
    }

}
