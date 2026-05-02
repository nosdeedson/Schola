import { Grade } from "@/domain/enum/grade/grade";
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
        ratingId: string;
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
                        this.ratingId = rating.quarter.id;
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
