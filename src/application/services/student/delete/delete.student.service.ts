import { DeleteGenericService } from "src/application/services/@shared/delete-generic-service";
import { StudentRepositoryInterface } from "src/domain/student/student.repository.interface";

export class DeleteStudentService extends DeleteGenericService{

    private studentRepository: StudentRepositoryInterface;

    constructor(studentRepository: StudentRepositoryInterface){
        super();
        this.studentRepository = studentRepository;
    }

    async execute(id: string): Promise<void>{
        try {
            await this.studentRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

}