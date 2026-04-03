import { Grade } from "@/domain/enum/grade/grade";
import { RatingEntity } from "@/infrastructure/entities/rating/rating.entity";

export class UpdateRatingDto {
    id: string;
    listing: Grade;
    writing: Grade;
    reading: Grade;
    speaking: Grade;
    grammar: Grade;
    homework: Grade;
    vocabulary: Grade;

    constructor(
        id: string,
        listing: Grade,
        writing: Grade,
        reading: Grade,
        speaking: Grade,
        grammar: Grade,
        homework: Grade,
        vocabulary: Grade
    ){
        this.id = id;
        this.listing = listing;
        this.writing = writing;
        this.reading = reading;
        this.speaking = speaking;
        this.grammar = grammar;
        this.homework = homework;
        this.vocabulary = vocabulary;
    }

    updateEntity(entity: RatingEntity): RatingEntity{
        entity.listing = this.listing;
        entity.writing = this.writing;
        entity.reading = this.reading;
        entity.speaking = this.speaking;
        entity.grammar = this.grammar;
        entity.homework = this.homework;
        entity.vocabulary = this.vocabulary;
        return entity;
    }
}