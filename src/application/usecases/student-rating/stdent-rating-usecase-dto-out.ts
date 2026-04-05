import { Grade } from "@/domain/enum/grade/grade";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";

export class StudentRatingUsecaseDtoOut {
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

        static toDto(rating: RatingEntity): StudentRatingUsecaseDtoOut {
                if (!rating) return null;
                return new StudentRatingUsecaseDtoOut(rating);
        }
}
