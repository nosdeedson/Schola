import { CommentRepositoryInterface } from "@/domain/comment/comment.repository.interface";
import { RatingRepositoryInterface } from "@/domain/rating/rating.repository.interface";
import { StudentCommentRatingUsecaseDto } from "./comment-rating-usecase-dto";
import { ExceptionHandler } from "@/infrastructure/utils/exception-handler/exception-handler";
import { CreateCommentService } from "@/application/services/comment/create/create.comment.service";
import { CreateCommentDto } from "@/application/services/comment/create/create.comment.dto";
import { SystemError } from "@/application/services/@shared/system-error";

export class CommentRatingUsecase {

    constructor(
        private ratingRepository: RatingRepositoryInterface,
        private commentRepository: CommentRepositoryInterface
    ) { }

    async execute(dto: StudentCommentRatingUsecaseDto) {
        try {
            const ratingEntity = await this.ratingRepository.find(dto.ratingId);
            if (!ratingEntity) throw new SystemError([{ context: "rating", message: 'rating not found' }], 404)
            const createCommentService = new CreateCommentService(this.commentRepository);
            const commentDto = new CreateCommentDto(dto.comment, dto.namePersonHaveDone, ratingEntity);
            await createCommentService.execute(commentDto);
        } catch (error: any) {
            ExceptionHandler.exceptionHandler(error);
        }
    }

}
