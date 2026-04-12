import { FindTeacherClassesService } from "@/application/services/class/find-teacher-classes/find.teacher-classes";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { ClassesOfTeacherDto } from "./classes-of-teacher-dto";

export class TeacherListClassesUsecase {

    constructor(private classRepository: ClassRepository) { }

    async execute(idTeacher: string): Promise<ClassesOfTeacherDto[]> {
        const service = new FindTeacherClassesService(this.classRepository);
        return await service.execute(idTeacher);
    }
}
