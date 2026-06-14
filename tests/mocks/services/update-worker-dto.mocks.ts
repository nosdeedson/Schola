import { InputUpdateWorkerDto } from "@/application/services/worker/update/update.worker.dto";
import { RoleEnum } from "@/domain/worker/roleEnum";

type InputUpdateWorkerDtoMock = {
    id?: string;
    name?: string;
    role?: RoleEnum;
}

export function mockInputUpdateWoker(
    overrides: InputUpdateWorkerDtoMock = {}
): InputUpdateWorkerDto {
    return {
        id: overrides.id ?? "123",
        name: overrides.name ?? "edson",
        role: overrides.role ?? RoleEnum.ADMINISTRATOR
    }
}
