import { Comment } from "@/domain/comment/comment";
import { Grade } from "@/domain/enum/grade/grade";
import { Rating } from "@/domain/rating/rating";
import { QuarterResponseDto } from "@/infrastructure/api/controllers/semester/dto/find/quarter-response-dto";
import { CommentEntity } from "@/infrastructure/entities/comment/comment.entity";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";

export class RatingCommentResponseDto {
        namePersonHaveDone: string;
        comment: string;
        commentId: string;
        private constructor() { }

        static from(comment: Comment): RatingCommentResponseDto {
                const dto = new RatingCommentResponseDto();
                dto.comment = comment.getComment();
                dto.commentId = comment.getId();
                dto.namePersonHaveDone = comment.getNamePersonHaveDone();
                return dto;
        }
}

export class StudentRatingUsecaseResponseDto {
        id: string;
        ratingDate: Date;
        listing: Grade;
        writing: Grade;
        reading: Grade;
        speaking: Grade;
        grammar: Grade;
        homework: Grade;
        vocabulary: Grade;
        studentId: string;
        studentName: string;
        quarter: QuarterResponseDto;
        comments?: RatingCommentResponseDto[] = [];

        private constructor(rating: Rating) {
                if (rating) {
                        this.id = rating.getId();
                        this.ratingDate = rating.getRatingDate();
                        this.listing = rating.getListing();
                        this.writing = rating.getWriting();
                        this.reading = rating.getReading();
                        this.speaking = rating.getSpeaking();
                        this.grammar = rating.getGrammar();
                        this.homework = rating.getHomework();
                        this.vocabulary = rating.getVocabulary();
                        this.studentId = rating.getStudent().getId();
                        this.studentName = rating.getStudent().getName();
                        this.quarter = QuarterResponseDto.fromQuarterEntity(rating.getQuarter());
                        if (rating?.getComments()) {
                                rating?.getComments().forEach(
                                        it => this.comments.push(RatingCommentResponseDto.from(it))
                                );
                        }
                }
        }

        static toDto(ratings: Rating[]): StudentRatingUsecaseResponseDto[] {
                if (!ratings) return [];
                const response: StudentRatingUsecaseResponseDto[] = [];
                for (let rating of ratings) {
                        response.push(new StudentRatingUsecaseResponseDto(rating));
                }
                return response;
        }
}
