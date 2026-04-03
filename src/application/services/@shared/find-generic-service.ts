import { FindUserOutPutDto } from "@/infrastructure/api/controllers/users/dtos/find-user-dto/find-user-outPut-dto";

export abstract class FindGenericService {
    public abstract execute(id: string): Promise<any>;
}