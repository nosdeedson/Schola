import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";
import { FindAllUserDto } from "./findAll.user.dto";

export class FindAllUserService {

    private userRepository: UserRepositoryInterface

    constructor(userRepository: UserRepositoryInterface){
        this.userRepository = userRepository;
    }

    async execute(): Promise<FindAllUserDto>{
        let users = await this.userRepository.findAll();
        let all = new FindAllUserDto(users);
        return all;
    }
}