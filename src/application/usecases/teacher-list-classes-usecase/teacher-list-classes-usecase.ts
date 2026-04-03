import { FindTeacherClassesService } from "src/application/services/class/find-teacher-classes/find.teacher-classes";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { ClassesOfTeacherDto } from "./classes-of-teacher-dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TeacherListClassesUsecase {

    public classRepository: ClassRepository;

    constructor(private repositoryFactory: RepositoryFactoryService) {
        this.classRepository = this.repositoryFactory.createRepository(TypeRepository.CLASS);
    }
    

    async execute(idTeacher: string): Promise<ClassesOfTeacherDto[]>{
        const service = new FindTeacherClassesService(this.classRepository);
        return await service.execute(idTeacher);
    }
}