import { DeleteClassService } from "@/application/services/class/delete/delete.class.service";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";

export class DeleteSchoolgroupUsecase {

    constructor (private classRepository: ClassRepositoryInterface){}

    async execute(id: string): Promise<void> {
        let deleteService = new DeleteClassService(this.classRepository);
        deleteService.execute(id);
    }
    
}