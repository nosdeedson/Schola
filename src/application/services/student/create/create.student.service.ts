import { SystemError } from "src/application/services/@shared/system-error";
import { NotificationErrorProps } from "@/domain/@shared/notification/notification";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { Student } from "@/domain/student/student";
import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { CreateStudentDto } from "./create.student.dto";
import { CreateGenericService } from "src/application/services/@shared/create-generic-service";

export class CreateStudentService extends CreateGenericService{

    private studentRepository: StudentRepositoryInterface;
    private schoolgroupRepository: ClassRepositoryInterface;
    
    constructor(
        studentRepository: StudentRepositoryInterface,
        schoolgroupRepository: ClassRepositoryInterface,
    ) {
        super(studentRepository);
        this.studentRepository = studentRepository;
        this.schoolgroupRepository = schoolgroupRepository;
    }

    async execute(dto: CreateStudentDto) {
        try {
            let errors: NotificationErrorProps[] = [];
            const schoolGroup = await this.schoolgroupRepository.findByClassCode(dto.enrolled);
            if (!schoolGroup) {
                errors.push({ context: 'student', message: 'Schoolgroup not found' });
                throw new SystemError(errors);
            }
            const fromBD = await this.studentRepository.findStudentByNameAndParentNames(dto.name, dto.parentsName);
            if( fromBD ){
                fromBD.birthday = dto.birthday;
                fromBD.enrolled = dto.enrolled;
                fromBD.updatedAt = new Date();
                await this.studentRepository.create(fromBD);
                return fromBD;
            } else {
                let student = new Student({ birthday: dto.birthday, name: dto.name, enrolled: dto.enrolled});
                if(student?.notification?.hasError()){
                    throw new SystemError(student.notification.errors);
                }
                let studentEntity = StudentEntity.toStudentEntity(student);
                return await this.studentRepository.create(studentEntity);
            }
        } catch (error) {
            throw error;
        }
    }


}