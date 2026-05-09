import { Grade } from "@/domain/enum/grade/grade";
import { QuarterResponseDto } from "@/infrastructure/api/controllers/semester/dto/find/quarter-response-dto";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";

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
        comments?: string[];

        private constructor(rating: RatingEntity) {
                if (rating) {
                        this.id = rating.id;
                        this.ratingDate = rating.ratingDate;
                        this.listing = rating.listing;
                        this.writing = rating.writing;
                        this.reading = rating.reading;
                        this.speaking = rating.speaking;
                        this.grammar = rating.grammar;
                        this.homework = rating.homework;
                        this.vocabulary = rating.vocabulary;
                        this.studentId = rating.student.id;
                        this.studentName = rating.student.fullName;
                        this.quarter = QuarterResponseDto.fromQuarterEntity(rating.quarter);
                        if (rating?.comments) {
                                this.comments = [];
                                rating?.comments.forEach(it => this.comments.push(it?.comment))
                        }
                }
        }

        static toDto(ratings: RatingEntity[]): StudentRatingUsecaseResponseDto[] {
                if (!ratings) return [];
                const response: StudentRatingUsecaseResponseDto[] = [];
                for (let rating of ratings) {
                        response.push(new StudentRatingUsecaseResponseDto(rating));
                }
                return response;
        }
}
