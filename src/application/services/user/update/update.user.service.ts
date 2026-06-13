import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { SystemError } from "@/application/services/@shared/system-error";
import { UpdateUserDto } from "./update.user.dto";
import { UserMapper } from "@/infrastructure/mappers/user/user-mapper";

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
            const newEmail = dto?.email ? dto.email : user.getEmail();
            user.setEmail(newEmail);
            const newNickname = dto?.nickname ? dto.nickname : user.getNickname();
            user.setNickanme(newNickname);
            const newPassword = dto?.password ? dto.password : user.getPassword();
            user.setPassword(newPassword);
            await this.userRepository.update(UserMapper.fromDomain(user));
        }
    }

}
