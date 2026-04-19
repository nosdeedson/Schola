import { SystemError } from "@/application/services/@shared/system-error";
import { DeleteUserService } from "@/application/services/user/delete/delete.user.service";
import { FindUserService } from "@/application/services/user/find/find.user.service";
import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { DeleteUserFactoryService } from "@/infrastructure/factory/delete-user-factory/delete-user-factory.service";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";


export class DeleteUserUsecase {

    private userRepository: UserRepositoryInterface;

    constructor(
        private userDeleteFactory: DeleteUserFactoryService,
        private repositoryFactory: RepositoryFactoryService
    ) {
        this.userRepository = repositoryFactory.createRepository(TypeRepository.USER);
    }

    async execute(id: string): Promise<void> {
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
}
