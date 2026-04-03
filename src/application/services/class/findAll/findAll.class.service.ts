import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { FindAllClassDto } from "./findAll.class.dto";

export class FindAllClassService{

    private classRepository: ClassRepositoryInterface;

    constructor(classRepository: ClassRepositoryInterface){
        this.classRepository = classRepository;
    }

    async execute(): Promise<FindAllClassDto>{
        let entities = await this.classRepository.findAll();
        let dtos = new FindAllClassDto(entities);
        return dtos;
    }
}