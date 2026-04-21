import { AccessType } from "@/domain/user/access.type";
import { CreateGenericService } from "../../application/services/@shared/create-generic-service";

export interface CreateUserFactotyInterface {
    createUserServiceFactory(accessType: AccessType): CreateGenericService;
}