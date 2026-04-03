import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";

export class DeleteClassService{

    private classRepository: ClassRepositoryInterface;

    constructor(classRepository: ClassRepositoryInterface){
        this.classRepository = classRepository;
    }

    async execute(id: string){
        await this.classRepository.delete(id);
    }
}