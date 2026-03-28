import { Injectable } from '@nestjs/common';
import { CreateUserService } from 'src/application/services/user/create/create.user.service';
import { InputCreateUserDto } from 'src/application/services/user/create/input.create.user.dto';
import { DeleteUserService } from 'src/application/services/user/delete/delete.user.service';
import { FindUserService } from 'src/application/services/user/find/find.user.service';
import { CreateUserFactoryService } from 'src/infrastructure/factory/create-user-service-factory/create-user-factory-service';
import { DeleteUserFactoryService } from 'src/infrastructure/factory/delete-user-factory/delete-user-factory.service';
import { RepositoryFactoryService } from 'src/infrastructure/factory/repositiry-factory/repository-factory.service';
import { TypeRepository } from 'src/infrastructure/factory/repositiry-factory/type-repository';
import { UserRepository } from 'src/infrastructure/repositories/user/user.repository';
import { TrataErros } from 'src/infrastructure/utils/trata-erros/trata-erros';
import { CreateUserRequestDto } from '../../../infrastructure/api/controllers/users/dtos/create-user-dto/create-user-request-dto';
import { FindUserOutPutDto } from '../../../infrastructure/api/controllers/users/dtos/find-user-dto/find-user-outPut-dto';
import { FindUserFactoryService } from 'src/infrastructure/factory/find-user-factory/find-user-factory.service';
import { CreatePersonFactoryService } from 'src/infrastructure/factory/create-person/create-person-factory.service';

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

    async create(dto: CreateUserRequestDto): Promise<void> {
        try {
            let createPerson = CreatePersonFactoryService.createDTOPersonFactory(dto);
            let createperson = this.userServiceFactory.createUserServiceFactory(dto.accessType);
            const person = await createperson.execute(createPerson);
            let createUser = new CreateUserService(this.userRepository, createperson.personRepository);
            let input = new InputCreateUserDto(dto, person.id);
            await createUser.execute(input);
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error);
        }
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
            TrataErros.tratarErrorsBadRequest(error);
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
            TrataErros.tratarErrorsBadRequest(error);
        }
    }

    async findAll(): Promise<FindUserOutPutDto[]>{
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
