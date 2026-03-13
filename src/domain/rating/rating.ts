import { Entity } from "../@shared/entity";
import { Grade } from "../enum/grade/grade";
import { Student } from "../student/student";
import { RatingValidator } from '../rating/rating.validator'
import { Comment } from "../comment/comment";
import { Quarter } from "../quarter/quarter";

export class Rating extends Entity {

    private comments: Comment[];
    private quarter: Quarter;
    private student: Student;
    private ratingDate: Date;
    private listing: Grade;
    private writing: Grade;
    private reading: Grade;
    private speaking: Grade;
    private grammar: Grade;
    private homework: Grade;
    private vocabulary: Grade;

    constructor(
        quarter: Quarter,
        student: Student,
        ratingDate: Date,
        listing: Grade,
        writing: Grade,
        reading: Grade,
        speaking: Grade,
        grammar: Grade,
        homework: Grade,
        vocabulary: Grade,
        id?: string, 
        createdAt?: Date, 
        updatedAt?: Date, 
        deletedAt?: Date
    ){
        super(id, createdAt, updatedAt, deletedAt);
        this.quarter = quarter;
        this.student = student;
        this.ratingDate = ratingDate;
        this.listing = listing;
        this.writing = writing;
        this.reading = reading;
        this.speaking = speaking;
        this.grammar = grammar;
        this.homework = homework;
        this.vocabulary = vocabulary;
        this.validate();
    }

    validate() {
        new RatingValidator().validate(this);
    }

    getComments(): Comment[]{
        return this.comments;
    }

    setComments(comment: Comment) {
        if(!this.comments){
            this.comments = [];
        }
        this.comments.push(comment)
    }
    
    getQuarter(): Quarter{
        return this.quarter;
    }

    getStudent(): Student{
        return this.student;
    }

    getRatingDate(): Date{
        return this.ratingDate;
    }

    getListing(): Grade{
        return this.listing;
    }

    setListing(listing: Grade) {
        this.listing = listing;
    }

    getWriting(): Grade{
        return this.writing;
    }

    setWriting(writing: Grade){
        this.writing = writing;
    }

    getReading(): Grade{
        return this.reading;
    }

    setReading(reading: Grade){
        this.reading = reading;
    }

    getSpeaking(): Grade{
        return this.speaking
    } 

    setSpeaking(speaking: Grade){
        this.speaking = speaking;
    }

    getGrammar(): Grade{
        return this.grammar;
    }

    setGrammar(grammar: Grade){
        this.grammar = grammar;
    }

    getHomework(): Grade{
        return this.homework;
    }

    setHomework( homework: Grade){
        this.homework = homework;
    }

    getVocabulary(): Grade{
        return this.vocabulary;
    }
    
    setVocabulary(vocabulary: Grade){
        this.vocabulary = vocabulary;
    }
}