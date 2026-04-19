import { Provider } from "@nestjs/common";
import { PARENT_REPOSITORY, STUDENT_REPOSITORY, USER_REPOSITORY, WORKER_REPOSITORY } from "../../controller-tokens/controller-tokens";
import { UserRepository } from "@/infrastructure/repositories/user/user.repository";
import { StudentRepository } from "@/infrastructure/repositories/student/student.repository";
import { WorkerRepository } from "@/infrastructure/repositories/worker/worker.repository";
import { ParentRepository } from "@/infrastructure/repositories/parent/parent.repository";

export const userRepositoriesProviders: Provider[] = [
    {
        provide: USER_REPOSITORY,
        useClass: UserRepository
    },
    {
        provide: STUDENT_REPOSITORY,
        useClass: StudentRepository
    },
    {
        provide: WORKER_REPOSITORY,
        useClass: WorkerRepository
    },
    {
        provide: PARENT_REPOSITORY,
        useClass: ParentRepository
    }
]
