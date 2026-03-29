import { CreateAcademicSemesterService } from "src/application/services/academic-semester/create/create.academic-semester.service";
import { AcademicSemesterInterface } from "src/domain/academc-semester/academic.semester.repository.interface";
import { RepositoryFactoryService } from "src/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "src/infrastructure/factory/repositiry-factory/type-repository";
import { AcademicSemesterRepository } from "src/infrastructure/repositories/academic-semester/academic-semester.repository";
import { CreateAcademicSemesterUsecaseDto } from "src/application/services/academic-semester/create/semester/academic-semester-usecase.dto";
import { TrataErros } from "src/infrastructure/utils/trata-erros/trata-erros";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateSemesterUsecase {

    private repository: AcademicSemesterInterface;

    constructor(
            private repositoryFactory: RepositoryFactoryService
    ) {
        this.repository = this.repositoryFactory.createRepository(TypeRepository.ACADEMIC_SEMESTER) as AcademicSemesterRepository;
    }

    async create(dto: CreateAcademicSemesterUsecaseDto): Promise<void> {
        try {
            let createServive = new CreateAcademicSemesterService(this.repository);
            await createServive.execute(dto);
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error);
        }
    }

}