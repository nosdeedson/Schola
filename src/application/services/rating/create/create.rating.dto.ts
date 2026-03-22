import { AcademicSemester } from "src/domain/academc-semester/academic.semester";
import { Grade } from "src/domain/enum/grade/grade";
import { Quarter } from "src/domain/quarter/quarter";
import { Student } from "src/domain/student/student";
import { AcademicSemesterEntity } from "src/infrastructure/entities/academic-semester/academic.semester.entity";
import { StudentEntity } from "src/infrastructure/entities/student/student.entity";

export class CreateRatingDto{
    
    student: Student;
    quarter: Quarter;
    listing: Grade;
    writing: Grade;
    reading: Grade;
    speaking: Grade;
    grammar: Grade;
    homework: Grade;
    vocabulary: Grade;

    constructor(
        student: Student,
        quater: Quarter,
        listing: Grade,
        writing: Grade,
        reading: Grade,
        speaking: Grade,
        grammar: Grade,
        homework: Grade,
        vocabulary: Grade,
    ){
        this.student = student;
        this.quarter = quater;
        this.listing = listing;
        this.writing = writing;
        this.reading = reading;
        this.speaking = speaking;
        this.grammar = grammar;
        this.homework = homework;
        this.vocabulary = vocabulary;
    }

}