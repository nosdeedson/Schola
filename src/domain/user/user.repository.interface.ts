import { UserEntity } from "@/infrastructure/entities/user/user.entity";
import { RepositoryInterface } from '../@shared/repository/repository.interface';
import { User } from "./user";

export interface UserRepositoryInterface extends RepositoryInterface<UserEntity, User>{}