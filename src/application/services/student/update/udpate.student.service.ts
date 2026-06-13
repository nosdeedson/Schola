import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { UpdateStudentDto } from "./udpate.student.dto";
import { SystemError } from "@/application/services/@shared/system-error";
import { Student } from "@/domain/student/student";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";

export class UpdateStudentService {

    private studentRepository: StudentRepositoryInterface;

    constructor(studentRepository: StudentRepositoryInterface) {
        this.studentRepository = studentRepository;
    }

    async execute(dto: UpdateStudentDto): Promise<void> {
        let student = await this.studentRepository.find(dto.id) as Student;
        if (!student) {
            throw new SystemError([{ context: 'student', message: 'student not found' }], 404)
        }
        student.setEnrolled(dto.enrolled);
        await this.studentRepository.update(StudentMapper.fromDomain(student));
    }
}
