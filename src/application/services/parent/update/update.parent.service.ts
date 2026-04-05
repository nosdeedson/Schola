import { ParentReporitoryInterface } from "@/domain/parent/parent.repository.interface";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { SystemError } from "@/application/services/@shared/system-error";

export class UpdateParentService {

    private parentRepository: ParentReporitoryInterface;

    constructor(parentRepository: ParentReporitoryInterface) {
        this.parentRepository = parentRepository;
    }

    async execute(birthday: Date, name: string, parentId: string) {
        try {
            let parent = await this.parentRepository.find(parentId) as ParentEntity;
            if (!parent) {
                throw new SystemError([{ context: 'parent', message: 'Parent not found' }]);
            }
            parent.birthday = birthday;
            parent.fullName = name;
            await this.parentRepository.update(parent);
        } catch (error) {
            throw error;
        }
    }
}
