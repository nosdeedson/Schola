import { ParentReporitoryInterface } from "@/domain/parent/parent.repository.interface";
import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { CreateGenericService } from "../../@shared/create-generic-service";
import { CreateParentDto } from "../../parent/create/create.parent.dto";
import { CreateParentService } from "../../parent/create/create.parent.service";
import { Student } from "@/domain/student/student";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { ParentStudentRepository } from "@/infrastructure/repositories/parent-student/parent.student.repositoy";
import { ParentStudentEntity } from "@/infrastructure/entities/parent-student/parent.student.entity";
import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { CreateStudentDto } from "../../student/create/create.student.dto";
import { CreateStudentService } from "../../student/create/create.student.service";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { Parent } from "@/domain/parent/parent";
import { PersonEntity } from "@/infrastructure/entities/@shared/person.entity";

export class CreateParentStudentService extends CreateGenericService {

    private parentRepository: ParentReporitoryInterface;
    private studentRepository: StudentRepositoryInterface;
    private parentStudentRepository: ParentStudentRepository;
    private classRepository: ClassRepository;

    constructor(params: {
        parentRepository: ParentReporitoryInterface,
        studentRepository: StudentRepositoryInterface,
        parentStudentRepository: ParentStudentRepository,
        classRepository: ClassRepository,
    }
    ) {
        super(params.parentRepository);
        this.parentRepository = params.parentRepository;
        this.studentRepository = params.studentRepository;
        this.parentStudentRepository = params.parentStudentRepository;
        this.classRepository = params.classRepository;
    }

    public async execute(dto: any): Promise<PersonEntity> {
        try {
            if (dto instanceof CreateParentDto) {
                const input = dto as CreateParentDto;
                const parentService = new CreateParentService(this.parentRepository);
                const parentEntity = await parentService.execute(input) as ParentEntity;;
                for (const studentName of input.students) {
                    const existStudent = await this.studentRepository.findStudentByNameAndParentNames(studentName, [dto.name]);
                    if (existStudent) continue;
                    const student = new Student({ name: studentName });
                    const studentEntity = StudentEntity.toStudentEntity(student);
                    const savedStudent = await this.studentRepository.create(studentEntity) as StudentEntity;
                    const parentStudent = ParentStudentEntity.toParentStudentEntity(parentEntity, savedStudent);
                    await this.parentStudentRepository.create(parentStudent);
                }
                return parentEntity;
            } else {
                const input = dto as CreateStudentDto;
                const studentService = new CreateStudentService(this.studentRepository, this.classRepository);
                const studentEntity = await studentService.execute(input) as StudentEntity;
                for (const parentName of input.parentsName) {
                    const parentExist = await this.parentRepository.findByParentNameAndStudentNames(parentName, [dto.name]);
                    if (parentExist) continue;
                    const parent = new Parent({ name: parentName });
                    const parentEntity = ParentEntity.toParentEntity(parent);
                    const savedParent = await this.parentRepository.create(parentEntity) as ParentEntity;
                    const parentStudent = ParentStudentEntity.toParentStudentEntity(savedParent, studentEntity);
                    await this.parentStudentRepository.create(parentStudent);
                }
                return studentEntity;
            }
        } catch (error) {
            throw error;
        }
    }

}
