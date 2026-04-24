import { SystemError } from "@/application/services/@shared/system-error";
import { FindUserDto } from "@/application/services/user/find/find.user.dto";
import { FindUserService } from "@/application/services/user/find/find.user.service";
import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { FindUserFactoryService } from "@/infrastructure/factory/find-user-factory/find-user-factory.service";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";
import { UserRepository } from "@/infrastructure/repositories/user/user.repository";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";

export class FindUserUsecase {

    private userRepository: UserRepositoryInterface;
    
        constructor(
            userRepository: UserRepositoryInterface
        ) { 
            this.userRepository = userRepository;
         }
        
        async execute(id: string): Promise<FindUserDto> {
            try {
            let findUserService = new FindUserService(this.userRepository);
            let user = await findUserService.execute(id);
            return user;
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error as SystemError);
        }
    }
}