import { SystemError } from "@/application/services/@shared/system-error";
import { ParentReporitoryInterface } from "@/domain/parent/parent.repository.interface";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { CreateParentDto } from "./create.parent.dto";
import { CreateGenericService } from "@/application/services/@shared/create-generic-service";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";

export class CreateParentService extends CreateGenericService {

    private parentRepository: ParentReporitoryInterface;

    constructor(
        parentRepository: ParentReporitoryInterface,
    ) {
        super(parentRepository);
        this.parentRepository = parentRepository;
    }

    async execute(dto: CreateParentDto) {
        try {
            const parentExist = await this.parentRepository.findByParentNameAndStudentNames(dto.name, dto.students);
            if (parentExist) {
                parentExist.setBirthDay(dto.birthday);
                await this.parentRepository.update(ParentMapper.fromDomain(parentExist));
                return parentExist;
            } else {
                let parent = CreateParentDto.toParent(dto);
                if (parent?.notification.hasError()) {
                    throw new SystemError(parent.notification?.getErrors(), 422);
                }
                let entity = ParentMapper.fromDomain(parent);
                return await this.parentRepository.create(entity);
            }
        } catch (error) {
            throw error;
        }
    }
}
