import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { SystemError } from "../../@shared/system-error";
import { Class } from "@/domain/class/class";

export class FindTeacherClassRatingService {

    private classRepository: ClassRepositoryInterface;

    constructor(classRepository: ClassRepositoryInterface) {
        this.classRepository = classRepository;

    }

    async execute(teacherId: string, classId: string): Promise<Class> {
        try {
            const classEntity = await this.classRepository.findByTeacherIdAndClassId(teacherId, classId);
            if (!classEntity) throw new SystemError([{ context: "class", message: "class not found." }], 404)
            return classEntity;
        } catch (error) {
            throw error;
        }
    }
}
