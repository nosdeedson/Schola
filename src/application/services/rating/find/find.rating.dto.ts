import { Grade } from "@/domain/enum/grade/grade";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";

export class FindRatingDto{
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
        ratingEntity: RatingEntity
    ){
        this.id = ratingEntity.id;
        this.ratingDate = ratingEntity.ratingDate;
        this.listing = ratingEntity.listing;
        this.writing = ratingEntity.writing;
        this.reading = ratingEntity.reading;
        this.speaking = ratingEntity.speaking;
        this.grammar = ratingEntity.grammar;
        this.homework = ratingEntity.homework;
        this.vocabulary = ratingEntity.vocabulary;
        this.studentId = ratingEntity?.student?.id;
        this.semesterId = ratingEntity?.academicSemester?.id;
        if(ratingEntity?.comments){
            ratingEntity?.comments.forEach(it => {
                this.comments.push(it.comment)
            })
        }
    }

    
}