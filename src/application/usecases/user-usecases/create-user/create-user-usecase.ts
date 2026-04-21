import { CreateUserService } from "@/application/services/user/create/create.user.service";
import { InputCreateUserDto } from "@/application/services/user/create/input.create.user.dto";
import { CreateUserRequestDto } from "@/infrastructure/api/controllers/users/dtos/create-user-dto/create-user-request-dto";
import { CreatePersonFactoryService } from "@/infrastructure/factory/create-person/create-person-factory.service";
import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";
import { UserRepository } from "@/infrastructure/repositories/user/user.repository";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { SystemError } from "@/application/services/@shared/system-error";
import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { CreateUserFactotyInterface } from "@/interfaces/factory/create-user-factory.interface";
import { RepositoryFactoryInterface } from "@/interfaces/factory/repository-factory.interface";

export class CreateUserUsecase {
    private userRepository: UserRepositoryInterface;

    constructor(
        private userServiceFactory: CreateUserFactotyInterface, 
        private repositoryFactory: RepositoryFactoryInterface,
    ) {
    }
    
    async execute(dto: CreateUserRequestDto): Promise<void> {
        try {
            this.userRepository = this.repositoryFactory.createRepository(TypeRepository.USER) as UserRepository;
            let createPerson = CreatePersonFactoryService.createDTOPersonFactory(dto);
            let createperson = this.userServiceFactory.createUserServiceFactory(dto.accessType);
            const person = await createperson.execute(createPerson);
            let createUser = new CreateUserService(this.userRepository, createperson.personRepository);
            let input = new InputCreateUserDto(dto, person.id);
            await createUser.execute(input);
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error as SystemError);
        }
    }
}
