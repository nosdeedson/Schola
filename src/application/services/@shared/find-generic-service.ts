import { FindUserResponseDto } from "@/infrastructure/api/controllers/users/dtos/find-user-dto/find-user-response-dto";

export abstract class FindGenericService {
    public abstract execute(id: string): Promise<any>;
}