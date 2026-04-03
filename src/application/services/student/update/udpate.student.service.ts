import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { UpdateStudentDto } from "./udpate.student.dto";
import { SystemError } from "src/application/services/@shared/system-error";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";

export class UpdateStudentService {

    private studentRepository: StudentRepositoryInterface;

    constructor(studentRepository: StudentRepositoryInterface){
        this.studentRepository = studentRepository;
    }

    async execute(dto: UpdateStudentDto): Promise<void>{
        let student = await this.studentRepository.find(dto.id) as StudentEntity;
        if(!student){
            throw new SystemError([{context: 'student', message: 'student not found'}])
        }
        student.enrolled = dto.enrolled        
        await this.studentRepository.update(student);
    }
}