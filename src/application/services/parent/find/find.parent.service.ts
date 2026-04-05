import { ParentReporitoryInterface } from "@/domain/parent/parent.repository.interface";
import { FindParentDto } from "./find.parent.dto";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { SystemError } from "@/application/services/@shared/system-error";

export class FindParentService {

    private parentRepository: ParentReporitoryInterface;

    constructor(parentRepository: ParentReporitoryInterface) {
        this.parentRepository = parentRepository;
    }

    async execute(id: string): Promise<FindParentDto> {
        let entity = await this.parentRepository.find(id);
        if (!entity) {
            throw new SystemError([{ context: 'parent', message: 'Parent not found' }])
        }
        let dto = FindParentDto.toDto(entity as ParentEntity);
        return dto;
    }

}
