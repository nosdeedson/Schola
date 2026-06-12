import { ParentReporitoryInterface } from "@/domain/parent/parent.repository.interface";
import { FindAllParentDto } from "./findAll.parent.dto";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { Parent } from "@/domain/parent/parent";

export class FindAllParentService{

    private parentRepository: ParentReporitoryInterface;

    constructor(parentRepository: ParentReporitoryInterface){
        this.parentRepository = parentRepository;
    }

    async execute(): Promise<FindAllParentDto>{
        let entities = await this.parentRepository.findAll() as Parent[];
        let results = new FindAllParentDto(entities);
        return results;
    }

}