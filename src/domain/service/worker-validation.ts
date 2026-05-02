import { SystemError } from "@/application/services/@shared/system-error";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";

export class WorkerValidation {
    constructor(private classRepository: ClassRepository) { }

    async validateWorker(classCode: string, teacherName: string) {
        const schoolGroup = await this.classRepository.findByClassCode(classCode);
        if (!schoolGroup) {
            throw new SystemError([{ context: 'user', message: 'class not found' }]);
        }
        const noMatch = schoolGroup.teacher.fullName.toUpperCase() != teacherName.toUpperCase();
        if (noMatch) {
            throw new SystemError([{ context: 'user', message: 'You are not teaching in this class' }]);
        }
    }
}
