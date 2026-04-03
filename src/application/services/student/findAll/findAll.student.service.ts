import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { FindAllStudentDto } from "./findAll.student.dto";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";

export class FindAllStudentService {

    private studentRepository: StudentRepositoryInterface;

    constructor(studentRepository: StudentRepositoryInterface){
        this.studentRepository = studentRepository;
    }

    async execute(): Promise<FindAllStudentDto>{
        const entities = await this.studentRepository.findAll() as StudentEntity[]; 
        const results = new FindAllStudentDto(entities);
        return results;
    }
}