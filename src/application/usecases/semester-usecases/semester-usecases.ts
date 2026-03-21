import { Injectable } from "@nestjs/common";
import { CreateAcademicSemesterService } from "src/application/services/academic-semester/create/create.academic-semester.service";
import { DeleteAcademicSemesterService } from "src/application/services/academic-semester/delete/delete.academic-semester.service";
import { FindAcademicSemesterService } from "src/application/services/academic-semester/find/find.academic-semester.service";
import { FindAllAcademicSemesterDto } from "src/application/services/academic-semester/findAll/findAll.academic-semester.dto";
import { FindAllAcademicSemesterService } from "src/application/services/academic-semester/findAll/findAll.academic-semester.service";
import { AcademicSemesterRepository } from "src/infrastructure/repositories/academic-semester/academic-semester.repository";
import { TrataErros } from "src/infrastructure/utils/trata-erros/trata-erros";
import { RepositoryFactoryService } from "src/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "src/infrastructure/factory/repositiry-factory/type-repository";

@Injectable()
export class SemesterUsecases {

    private repository: AcademicSemesterRepository;

    constructor(
        private repositoryFactory: RepositoryFactoryService
    ){
        this.repository = this.repositoryFactory.createRepository(TypeRepository.ACADEMIC_SEMESTER) as AcademicSemesterRepository;
     }

    async delete(id: string): Promise<void>{
        let deleteService = new DeleteAcademicSemesterService(this.repository);
        await deleteService.execute(id);
    }

    async find(id: string): Promise<any>{
        try {
            let findService = new FindAcademicSemesterService(this.repository);
            return await findService.execute(id);
        } catch (error) {
            TrataErros.tratarErrorsNotFound(error);
        }
    }

    async findAll(): Promise<FindAllAcademicSemesterDto>{
        let all = new FindAllAcademicSemesterService(this.repository);
        return await all.execute();
    }

    async update(id: string, actual: boolean): Promise<any>{
        // let updateService = new UpdateAcademicSemesterService(this.repository);
        // let input = new UpdateAcademicSemesterDto(id, actual);
        // updateService.execute(input);
    }

}
