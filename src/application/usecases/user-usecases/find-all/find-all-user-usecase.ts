import { FindAllUserDto } from "@/application/services/user/findAll/findAll.user.dto";
import { FindAllUserService } from "@/application/services/user/findAll/findAll.user.service";
import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";

export class FindAllUserUsecase {

    private userRepository: UserRepositoryInterface;

    constructor(userRepository: UserRepositoryInterface) {
        this.userRepository = userRepository;
    }

    async execute(): Promise<FindAllUserDto> {
        let findAllUserService = new FindAllUserService(this.userRepository);
        const users = await findAllUserService.execute();
        return users;
    }
}
