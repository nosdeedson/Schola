import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { SystemError } from "@/application/services/@shared/system-error";
import { Student } from "@/domain/student/student";

export class FindStudentService {

    private studentRepository: StudentRepositoryInterface;

    constructor(studentRepository: StudentRepositoryInterface) {
        this.studentRepository = studentRepository;
    }

    async execute(id: string): Promise<Student> {
        const student = await this.studentRepository.find(id) as Student;
        if (!student) {
            throw new SystemError([{ context: 'student', message: 'student not found' }], 404);
        }
        return student;
    }

}
