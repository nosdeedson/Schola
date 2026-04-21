import { DeleteGenericService } from "@/application/services/@shared/delete-generic-service";
import { AccessType } from "@/domain/user/access.type";

export interface DeleteUserFactoryInterface {
    deleteUserServiceFactory(accessType: AccessType): DeleteGenericService;
}