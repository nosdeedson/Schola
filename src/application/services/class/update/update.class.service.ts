import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { UpdateClassDto } from "./udpate.class.dto";
import { SystemError } from "@/application/services/@shared/system-error";
import { WorkerMapper } from "@/infrastructure/mappers/worker/worker-mapper";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";

export class UpdateClassService {

    private classRepository: ClassRepositoryInterface;

    constructor(classRepository: ClassRepositoryInterface) {
        this.classRepository = classRepository;
    }

    async execute(dto: UpdateClassDto) {
        let schoolgroup = await this.classRepository.find(dto.id);
        if (!schoolgroup) {
            throw new SystemError([{ context: 'class', message: "class not found" }], 404);
        }
        schoolgroup.setNameBook(dto.nameBook);
        schoolgroup.setTeacher(WorkerMapper.fromEntity(dto.teacher));
        schoolgroup.setUpdatedAt(new Date());
        await this.classRepository.update(ClassMapper.fromDomain(schoolgroup));
    }
}
