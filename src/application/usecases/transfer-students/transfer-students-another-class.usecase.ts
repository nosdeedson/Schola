import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { TransferStudentsAnotherClassUseCaseDto } from "./transfer-students-another-class-usecase-dto";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { SystemError } from "@/application/services/@shared/system-error";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";

export class TransferStudentsAnotherClassUsecase {

    constructor(
        private readonly studentRepository: StudentRepositoryInterface,
        private readonly classRepository: ClassRepositoryInterface,
    ) { }

    async execute(transferStudents: TransferStudentsAnotherClassUseCaseDto): Promise<void> {
        try {
            const nextClass = await this.classRepository.find(transferStudents.classId);
            if (!nextClass) throw new SystemError([{ context: 'class', message: 'class not found' }]);
            let students = await this.studentRepository.findByIds(transferStudents.studentIds);
            students.forEach(it => {
                it.schoolGroup = nextClass;
            });
            await this.studentRepository.updateAll(students);
        } catch (error) {
            TrataErros.tratarErrorsNotFound(error as SystemError);
        }
    }

}
