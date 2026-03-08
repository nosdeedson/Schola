import { ClassRepositoryInterface } from "src/domain/class/class.repository.interface";
import { UpdateClassDto } from "./udpate.class.dto";
import { SystemError } from "src/application/services/@shared/system-error";

export class UpdateClassService{

    private classRepository: ClassRepositoryInterface;

    constructor(classRepository: ClassRepositoryInterface){
        this.classRepository = classRepository;
    }

    async execute(dto: UpdateClassDto){
        let schoolgroup = await this.classRepository.find(dto.id);
        if(!schoolgroup){
            throw new SystemError([{context: 'class', message: "class not found"}]);
        }
        schoolgroup.bookName = dto.nameBook;
        schoolgroup.teacher = dto.teacher;
        schoolgroup.updatedAt = new Date(2026, 3, 1, 23, 59, 59);
        await this.classRepository.update(schoolgroup);
    }
}