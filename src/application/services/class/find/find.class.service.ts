import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { FindClassDto } from "./find.class.dto";
import { SystemError } from "src/application/services/@shared/system-error";

export class FindClassService{

    private classRepository: ClassRepositoryInterface;

    constructor(classRepository: ClassRepositoryInterface){
        this.classRepository = classRepository;
    }

    async execute(id: string): Promise<FindClassDto>{
        let schoolgroup = await this.classRepository.find(id);
        if(!schoolgroup){
            throw new SystemError([{context: 'class', message: 'class not found'}])
        }
        let dto = FindClassDto.toDto(schoolgroup);
        return dto;
    }

}