import { CreateRatingService } from "@/application/services/rating/create/create.rating.service";
import { AcademicSemesterInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { QuarterRepositoryInterface } from "@/domain/quarter/quarter.repository.interface";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { RepositoryFactoryService } from "@/infrastructure/factory/repositiry-factory/repository-factory.service";
import { TypeRepository } from "@/infrastructure/factory/repositiry-factory/type-repository";
import { BadRequestException, Injectable } from "@nestjs/common";
import { SaveRatingUsecaseDto } from "./save-rating-usecase-dto";
import { FindCurrentSemesterService } from "@/application/services/academic-semester/find-current/find-current-semester.service";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { SystemError } from "@/application/services/@shared/system-error";
import { Quarter } from "@/domain/quarter/quarter";
import { FindStudentService } from "@/application/services/student/find/find.student.service";
import { Rating } from "@/domain/rating/rating";
import { Student } from "@/domain/student/student";
import { CreateRatingDto } from "@/application/services/rating/create/create.rating.dto";

@Injectable()
export class SaveRatingUsecase {

    private ratingRepository: RatingRepositoryInterface;
    private semesterRespository: AcademicSemesterInterface;
    private studentRepository: StudentRepositoryInterface;

    constructor(private repositoryFactory: RepositoryFactoryService) {
        this.ratingRepository = repositoryFactory.createRepository(TypeRepository.RATING);
        this.semesterRespository = repositoryFactory.createRepository(TypeRepository.ACADEMIC_SEMESTER);
        this.studentRepository = repositoryFactory.createRepository(TypeRepository.STUDENT);
    }

    async execute(dto: SaveRatingUsecaseDto): Promise<void> {
        try {
            const semesterService = new FindCurrentSemesterService(this.semesterRespository);
            const semester = await semesterService.execute();
            const studentService = new FindStudentService(this.studentRepository);
            const studentEntity = await studentService.execute(dto.studentId);
            if(!studentEntity){
                throw new SystemError([{context: 'student', message: 'student not found'}])
            }
            let quarter: Quarter;
            if (semester.current) {
                const quarterEntity = semester.quarters[0].currentQuarter ? semester.quarters[0] : semester.quarters[1];
                quarter = Quarter.fromEntity(quarterEntity);
                const rating = new CreateRatingDto(
                    Student.toDomain(studentEntity),
                    quarter, 
                    dto.listing,
                    dto.writing,
                    dto.reading,
                    dto.speaking,
                    dto.grammar,
                    dto.homework,
                    dto.vocabulary
                );
                const ratingCreate = new CreateRatingService(this.ratingRepository);
                ratingCreate.execute(rating)
            } else {
                throw new BadRequestException("Current semester was not found");
            }
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error as SystemError);
        }

    }


}