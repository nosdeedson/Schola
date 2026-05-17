import { CreateRatingService } from "@/application/services/rating/create/create.rating.service";
import { AcademicSemesterRespositoryInterface } from "@/domain/academc-semester/academic.semester.repository.interface";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { StudentRepositoryInterface } from "@/domain/student/student.repository.interface";
import { BadRequestException, Injectable } from "@nestjs/common";
import { SaveRatingUsecaseDto } from "./save-rating-usecase-dto";
import { FindCurrentSemesterService } from "@/application/services/academic-semester/find-current/find-current-semester.service";
import { TrataErros } from "@/infrastructure/utils/trata-erros/trata-erros";
import { SystemError } from "@/application/services/@shared/system-error";
import { Quarter } from "@/domain/quarter/quarter";
import { FindStudentService } from "@/application/services/student/find/find.student.service";
import { Student } from "@/domain/student/student";
import { CreateRatingDto } from "@/application/services/rating/create/create.rating.dto";
import { CommentRepositoryInterface } from "@/domain/comment/comment.repository.interface";
import { CreateCommentService } from "@/application/services/comment/create/create.comment.service";
import { CreateCommentDto } from "@/application/services/comment/create/create.comment.dto";
import { WorkerRepositoryInterface } from "@/domain/worker/worker.repository.interface";
import { FindWorkerService } from "@/application/services/worker/find/find.worker.service";

export class SaveRatingUsecase {

    constructor(
        private ratingRepository: RatingRepositoryInterface,
        private semesterRespository: AcademicSemesterRespositoryInterface,
        private studentRepository: StudentRepositoryInterface,
        private commentRepository: CommentRepositoryInterface,
        private workerRepo: WorkerRepositoryInterface,
    ) { }

    async execute(dto: SaveRatingUsecaseDto): Promise<void> {
        try {
            const semesterService = new FindCurrentSemesterService(this.semesterRespository);
            const semester = await semesterService.execute();
            if (!semester) throw new SystemError([{ context: 'semester', message: 'semester not found' }]);
            const studentService = new FindStudentService(this.studentRepository);
            const studentEntity = await studentService.execute(dto.studentBeingEvaluatedId);
            if (!studentEntity) throw new SystemError([{ context: 'student', message: 'student not found' }]);
            const workerService = new FindWorkerService(this.workerRepo);
            const teacher = await workerService.execute(dto.teacherId);
            if (!teacher) throw new SystemError([{ context: 'teacher', message: 'teacher not found' }]);
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
                const ratingEntity = await ratingCreate.execute(rating);
                const commentService = new CreateCommentService(this.commentRepository);
                const commentDto = new CreateCommentDto(dto.comment, teacher.name, ratingEntity);
                await commentService.execute(commentDto);
            } else {
                throw new BadRequestException("Current semester was not found");
            }
        } catch (error) {
            TrataErros.tratarErrorsBadRequest(error as SystemError);
        }

    }


}
