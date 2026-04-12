import { TeacherListClassesUsecase } from "@/application/usecases/teacher-list-classes-usecase/teacher-list-classes-usecase";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { CLASS_REPOSITORY } from "./teachers.tokens";

export const teacherListClassesUsecaseProvider = [
    {
        provide: TeacherListClassesUsecase,
        useFactory: (
            classRepo: ClassRepository
        ) => {
            return new TeacherListClassesUsecase(classRepo);
        },
        injest: [CLASS_REPOSITORY]
    }
]
