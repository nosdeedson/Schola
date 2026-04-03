import { DeleteGenericService } from "src/application/services/@shared/delete-generic-service";
import { ParentReporitoryInterface } from "@/domain/parent/parent.repository.interface";

export class DeleteParentService extends DeleteGenericService {

    private parentRepository: ParentReporitoryInterface;

    constructor(parentRepository: ParentReporitoryInterface){
        super();
        this.parentRepository = parentRepository;
    }

    async execute(id: string){
        try {
            await this.parentRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

}