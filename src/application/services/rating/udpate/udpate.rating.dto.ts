import { Grade } from "@/domain/enum/grade/grade";
import { Rating } from "@/domain/rating/rating";
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
    ) {
        this.id = id;
        this.listing = listing;
        this.writing = writing;
        this.reading = reading;
        this.speaking = speaking;
        this.grammar = grammar;
        this.homework = homework;
        this.vocabulary = vocabulary;
    }

    updateEntity(entity: Rating): Rating {
        entity.setListing(this.listing);
        entity.setWriting(this.writing);
        entity.setReading(this.reading);
        entity.setSpeaking(this.speaking);
        entity.setGrammar(this.grammar);
        entity.setHomework(this.homework);
        entity.setVocabulary(this.vocabulary);
        return entity;
    }
}
