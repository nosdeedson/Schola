import { Grade } from "@/domain/enum/grade/grade";
import { Rating } from "@/domain/rating/rating";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";

export class FindRatingDto {
    id: string;
    ratingDate: Date;
    listing: Grade;
    writing: Grade;
    reading: Grade;
    speaking: Grade;
    grammar: Grade;
    homework: Grade;
    vocabulary: Grade;
    studentId?: string;
    semesterId?: string;
    comments?: string[] = [];

    constructor(
        rating: Rating
    ) {
        this.id = rating.getId();
        this.ratingDate = rating.getRatingDate();
        this.listing = rating.getListing();
        this.writing = rating.getWriting();
        this.reading = rating.getReading();
        this.speaking = rating.getSpeaking();
        this.grammar = rating.getGrammar();
        this.homework = rating.getHomework();
        this.vocabulary = rating.getVocabulary();
        this.studentId = rating?.getStudent()?.getId();
        this.semesterId = rating?.getQuarter()?.getId();
        if (rating?.getComments()) {
            rating?.getComments().forEach(it => {
                this.comments.push(it.getComment())
            })
        }
    }


}
