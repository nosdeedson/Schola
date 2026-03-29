import { Injectable } from "@nestjs/common";
import { CreateUserService } from "src/application/services/user/create/create.user.service";
import { InputCreateUserDto } from "src/application/services/user/create/input.create.user.dto";
import { CreateUserRequestDto } from "src/infrastructure/api/controllers/users/dtos/create-user-dto/create-user-request-dto";
import { CreatePersonFactoryService } from "src/infrastructure/factory/create-person/create-person-factory.service";
import { CreateUserFactoryService } from "src/infrastructure/factory/create-user-service-factory/create-user-factory-service";
import { RepositoryFactoryService } from "src/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "src/infrastructure/factory/repositiry-factory/type-repository";
import { UserRepository } from "src/infrastructure/repositories/user/user.repository";
import { TrataErros } from "src/infrastructure/utils/trata-erros/trata-erros";


@Injectable()
export class CreateUserUsecase {
    private userRepository: UserRepository;
    
        constructor(
            private userServiceFactory: CreateUserFactoryService,
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
}