import { Injectable } from "@nestjs/common";
import { UpdateAcademicSemesterDto } from "@/application/services/academic-semester/update/udpate.academic-semester.dto";
import { UpdateAcademicSemesterService } from "@/application/services/academic-semester/update/update.academic-semester.service";
import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";

@Injectable()
export class UpdateSemesterUseCase {

    private semesterRepository: AcademicSemesterRespositoryInterface;

    constructor(private repositoryFactory: RepositoryFactoryService) {
        this.semesterRepository = repositoryFactory.createRepository(TypeRepository.ACADEMIC_SEMESTER);
    }

    async execute(updateSemester: UpdateAcademicSemesterDto) {
        try {
            const updateSemesterService = new UpdateAcademicSemesterService(this.semesterRepository);
            await updateSemesterService.execute(updateSemester);
        } catch (error) {
            TrataErros.tratarErrorsNotFound(error);
        }
    }
}
