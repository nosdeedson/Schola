import { SystemError } from "@/application/services/@shared/system-error";
import { FindUserDto } from "@/application/services/user/find/find.user.dto";
import { FindUserService } from "@/application/services/user/find/find.user.service";
import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";

export class FindUserUsecase {

    constructor(
        private userRepository: UserRepositoryInterface
    ) {    }

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
