import { ClassesOfTeacherDto } from "src/application/usecases/teacher-list-classes-usecase/classes-of-teacher-dto";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";

export class FindTeacherClassesService {

    private classRepository: ClassRepositoryInterface;

    constructor(classRepository: ClassRepositoryInterface){
        this.classRepository = classRepository;
    }

    async execute(id: string) : Promise<ClassesOfTeacherDto[]>{
        try {
            const myClasses = await this.classRepository.findByTeacherId(id);
            return ClassesOfTeacherDto.toClassesOfTeacher(myClasses);
        } catch (error) {
            throw error;
        }
    }
}