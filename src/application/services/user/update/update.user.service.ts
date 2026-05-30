import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { SystemError } from "@/application/services/@shared/system-error";
import { UpdateUserDto } from "./update.user.dto";

export class UpdateUserService {

    private userRepository: UserRepositoryInterface;

    constructor(userRepository: UserRepositoryInterface) {
        this.userRepository = userRepository;
    }

    async execute(dto: UpdateUserDto) {
        if (!dto.id) {
            throw new SystemError([{ context: 'user', message: 'id must be informed' }], 400);
        }
        if (!dto?.email && !dto?.nickname && !dto?.password) {
            throw new SystemError([{ context: 'user', message: 'at least one atribute must be passed to update an user' }], 404);
        }
        let user = await this.userRepository.find(dto.id);
        if (user) {
            user.email = dto?.email ? dto.email : user.email;
            user.nickname = dto?.nickname ? dto.nickname : user.nickname;
            user.password = dto?.password ? dto.password : user.password;
            await this.userRepository.update(user);
        }
    }

}
