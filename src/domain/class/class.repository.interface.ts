import { ClassEntity } from "@/infrastructure/entities/class/class.entity";
import { RepositoryInterface } from "../@shared/repository/repository.interface";
import { Class } from "./class";

export interface ClassRepositoryInterface extends RepositoryInterface<ClassEntity, Class> {
    findByClassCode(classCode: string): Promise<Class>;
    findByTeacherId(teacherId: string): Promise<Class[]>;
    findByTeacherIdAndClassId(teacherId: string, classId: string): Promise<Class>;
}
