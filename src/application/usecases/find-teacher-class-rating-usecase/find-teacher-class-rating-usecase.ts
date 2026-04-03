import { Injectable } from "@nestjs/common";
import { FindCurrentSemesterService } from "src/application/services/academic-semester/find-current/find-current-semester.service";
import { FindTeacherClassRatingService } from "src/application/services/class/find-teacher-class-rating/find-teacher-class-rating";
import { AcademicSemesterInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { ClassRepositoryInterface } from "@/domain/class/class.repository.interface";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";
import { ClassRepository } from "@/infrastructure/repositories/class/class.repository";
import { TeacherClassRatingDto } from "./find-teacher-class-rating-dto";

@Injectable()
export class FindTeacherClassRatingUsecase {

    private classRepository: ClassRepositoryInterface;
    private semesterRepository: AcademicSemesterInterface

    constructor(private repositoryFactory: RepositoryFactoryService){
        this.classRepository = this.repositoryFactory.createRepository(TypeRepository.CLASS);
        this.semesterRepository = this.repositoryFactory.createRepository(TypeRepository.ACADEMIC_SEMESTER);
    }

    async execute(teacherId: string, classId: string) : Promise<TeacherClassRatingDto> {
        try {
            const service = new FindTeacherClassRatingService(this.classRepository);
            const classEntity = await service.execute(teacherId, classId);
            const semesterService  = new FindCurrentSemesterService(this.semesterRepository);
            const semester = await semesterService.execute();
            return new TeacherClassRatingDto(classEntity, semester);
        } catch (error) {
            throw error;
        }
    }
}