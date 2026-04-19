import { TransferStudentsAnotherClassUsecase } from "@/application/usecases/transfer-students/transfer-students-another-class.usecase";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { CLASS_REPOSITORY, STUDENT_REPOSITORY } from "../../controller-tokens/controller-tokens";

export const studentTransferUsecaseProvider = [
    {
        provide: TransferStudentsAnotherClassUsecase,
        useFactory: (
            studentRepo: StudentRepository,
            classRepo: ClassRepository
        ) => {
            return new TransferStudentsAnotherClassUsecase(
                studentRepo, classRepo
            );
        },
        inject: [STUDENT_REPOSITORY, CLASS_REPOSITORY]
    },
]
