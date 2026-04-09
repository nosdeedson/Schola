import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { FindStutendDto } from "./find.student.dto";
import { SystemError } from "@/application/services/@shared/system-error";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";

export class FindStudentService {

    private studentRepository: StudentRepositoryInterface;

    constructor(studentRepository: StudentRepositoryInterface) {
        this.studentRepository = studentRepository;
    }

    async execute(id: string): Promise<StudentEntity> {
        const student = await this.studentRepository.find(id) as StudentEntity;
        if (!student) {
            throw new SystemError([{ context: 'student', message: 'student not found' }]);
        }
        return student;
    }

}
