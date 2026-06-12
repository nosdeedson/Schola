import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { SystemError } from "@/application/services/@shared/system-error";
import { FindUserDto } from "./find.user.dto";

export class FindUserService {

    private userRepository: UserRepositoryInterface;

    constructor(userRepository: UserRepositoryInterface) {
        this.userRepository = userRepository;
    }

    async execute(userId: string) {
        try {

            let user = await this.userRepository.find(userId);
            if (!user) {
                throw new SystemError([{ context: 'user', message: 'user not found' }], 404);
            }
            let dto = new FindUserDto(user.getId(), user.getPerson().getId(), user.getEmail(), user.getNickname(), user.getPerson().getName(), user.getAccessType());
            return dto;
        } catch (error) {
            throw error;
        }
    }

}
