import { UserEntity } from "@/infrastructure/entities/user/user.entity";
import { RepositoryInterface } from '../@shared/repository/repository.interface';

export interface UserRepositoryInterface extends RepositoryInterface<UserEntity>{
    // findPerson(personId: string, type: string): Promise<any>;
}