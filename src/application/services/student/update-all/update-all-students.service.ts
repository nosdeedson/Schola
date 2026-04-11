import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";

export class UpdateAllStudentsService {

    private studentRepository: StudentRepositoryInterface;

    constructor(studentRepository: StudentRepositoryInterface) {
        this.studentRepository = studentRepository;
    }

    async execute(students: StudentEntity[]) {
        await this.studentRepository.updateAll(students);
    }
}
