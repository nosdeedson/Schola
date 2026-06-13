import { Student } from "@/domain/student/student";
import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { StudentMapper } from "@/infrastructure/mappers/student/student-mapper";

export class UpdateAllStudentsService {

    private studentRepository: StudentRepositoryInterface;

    constructor(studentRepository: StudentRepositoryInterface) {
        this.studentRepository = studentRepository;
    }

    async execute(students: Student[]) {
        await this.studentRepository.updateAll(students.map(it => StudentMapper.fromDomain(it)));
    }
}
