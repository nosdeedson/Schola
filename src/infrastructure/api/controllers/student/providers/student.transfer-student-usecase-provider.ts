import { TransferStudentsAnotherClassUsecase } from "@/application/usecases/transfer-students/transfer-students-another-class.usecase";
import { CLASS_REPOSITORY, STUDENT_REPOSITORY } from "./students.tokens";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";

export const transferStudentUsecaseProvider = [
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
