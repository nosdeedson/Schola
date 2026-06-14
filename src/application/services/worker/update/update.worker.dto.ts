import { RoleEnum } from "../../../../domain/worker/roleEnum";

export interface InputUpdateWorkerDto {
    id: string;
    name: string;
    role: RoleEnum;
}
