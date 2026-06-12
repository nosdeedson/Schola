import { ParentReporitoryInterface } from "@/domain/parent/parent.repository.interface";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { SystemError } from "@/application/services/@shared/system-error";
import { Parent } from "@/domain/parent/parent";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";

export class UpdateParentService {

    private parentRepository: ParentReporitoryInterface;

    constructor(parentRepository: ParentReporitoryInterface) {
        this.parentRepository = parentRepository;
    }

    async execute(birthday: Date, name: string, parentId: string) {
        try {
            let parent = await this.parentRepository.find(parentId) as Parent;
            if (!parent) {
                throw new SystemError([{ context: 'parent', message: 'Parent not found' }], 404);
            }
            parent.setBirthDay(birthday);
            parent.setName(name);
            await this.parentRepository.update(ParentMapper.fromDomain(parent));
        } catch (error) {
            throw error;
        }
    }
}
