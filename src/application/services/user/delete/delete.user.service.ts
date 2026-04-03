import { UserRepositoryInterface } from "@/domain/user/user.repository.interface";

export class DeleteUserService{

    private userRepository: UserRepositoryInterface;

    constructor(userRepository: UserRepositoryInterface){
        this.userRepository = userRepository;
    }

    async execute(id: string){
        await this.userRepository.delete(id);
    }

}