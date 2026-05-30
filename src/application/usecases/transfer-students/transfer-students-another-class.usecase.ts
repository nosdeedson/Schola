import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { TransferStudentsAnotherClassUseCaseDto } from "./transfer-students-another-class-usecase-dto";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { SystemError } from "@/application/services/@shared/system-error";
import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";

export class TransferStudentsAnotherClassUsecase {

    constructor(
        private readonly studentRepository: StudentRepositoryInterface,
        private readonly classRepository: ClassRepositoryInterface,
    ) { }

    async execute(transferStudents: TransferStudentsAnotherClassUseCaseDto): Promise<void> {
        try {
            const nextClass = await this.classRepository.find(transferStudents.classId);
            if (!nextClass) throw new SystemError([{ context: 'class', message: 'class not found' }], 404);
            let students = await this.studentRepository.findByIds(transferStudents.studentIds);
            students.forEach(it => {
                it.schoolGroup = nextClass;
            });
            await this.studentRepository.updateAll(students);
        } catch (error) {
            ExceptionHandler.exceptionHandler(error as SystemError);
        }
    }

}
