import { Rating } from "@/domain/rating/rating";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Grade } from "../../../domain/enum/grade/grade";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { AcademicSemesterEntity } from "../academic-semester/academic.semester.entity";
import { CommentEntity } from "../comment/comment.entity";
import { StudentEntity } from "../student/student.entity";
import { QuarterEntity } from "../quarter/quarter.entity";


@Entity('rating')
export class RatingEntity extends GenericEntity {

    constructor() { super() }

    @Column({
        nullable: false,
        name: 'grammar',
        type: 'enum',
        enum: [
            Grade.BAD,
            Grade.EXCELENT,
            Grade.GOOD,
            Grade.REGULAR,
            Grade.VERY_GOOD,
        ]
    })
    grammar: Grade;

    @Column({
        nullable: false,
        name: 'homework',
        type: 'enum',
        enum: [
            Grade.BAD,
            Grade.EXCELENT,
            Grade.GOOD,
            Grade.REGULAR,
            Grade.VERY_GOOD,
        ]
    })
    homework: Grade;

    @Column({
        nullable: false,
        name: 'listining',
        type: 'enum',
        enum: [
            Grade.BAD,
            Grade.EXCELENT,
            Grade.GOOD,
            Grade.REGULAR,
            Grade.VERY_GOOD,
        ]
    })
    listing: Grade;

    @Column({
        nullable: false,
        name: 'rating_date',
        type: 'timestamp with time zone'
    })
    ratingDate: Date;

    @Column({
        nullable: false,
        name: 'reading',
        type: 'enum',
        enum: [
            Grade.BAD,
            Grade.EXCELENT,
            Grade.GOOD,
            Grade.REGULAR,
            Grade.VERY_GOOD,
        ]
    })
    reading: Grade;

    @Column({
        nullable: false,
        name: 'speaking',
        type: 'enum',
        enum: [
            Grade.BAD,
            Grade.EXCELENT,
            Grade.GOOD,
            Grade.REGULAR,
            Grade.VERY_GOOD,
        ]
    })
    speaking: Grade;

    @Column({
        nullable: false,
        name: 'vocabulary',
        type: 'enum',
        enum: [
            Grade.BAD,
            Grade.EXCELENT,
            Grade.GOOD,
            Grade.REGULAR,
            Grade.VERY_GOOD,
        ]
    })
    vocabulary: Grade;

    @Column({
        nullable: false,
        name: 'writing',
        type: 'enum',
        enum: [
            Grade.BAD,
            Grade.EXCELENT,
            Grade.GOOD,
            Grade.REGULAR,
            Grade.VERY_GOOD,
        ]
    })
    writing: Grade;

    @JoinColumn({
        name: 'academic_semester_id',
        foreignKeyConstraintName: 'fk_academic_semester',
        referencedColumnName: 'id'
    })
    @ManyToOne(() => QuarterEntity, quarter => quarter.ratings)
    academicSemester: AcademicSemesterEntity;

    @OneToMany(() => CommentEntity, comment => comment.rating)
    comments: CommentEntity[];

    @ManyToOne(() => StudentEntity, {cascade: true})
    @JoinColumn({
        name: 'student_id',
        foreignKeyConstraintName: 'fk_student_id'
    })
    student: StudentEntity;

    static toRatingEntity(rating: Rating): RatingEntity {
        let model = new RatingEntity();
        model.createdAt = rating.getCreatedAt();
        model.deletedAt = rating.getDeletedAt();
        model.grammar = rating.getGrammar();
        model.homework = rating.getHomework();
        model.id = rating.getId();
        model.listing = rating.getListing();
        model.ratingDate = rating.getRatingDate();
        model.reading = rating.getReading();
        model.speaking = rating.getSpeaking();
        model.student = StudentEntity.toStudentEntity(rating.getStudent());
        model.updatedAt = rating.getUpdatedAt();
        model.vocabulary = rating.getVocabulary();
        model.writing = rating.getWriting();
        // TODO FIX 
        // model.academicSemester = AcademicSemesterEntity.toAcademicSemester(rating.getAcademicSemester());
        return model;
    }

    static toRatingsEntity(ratings: Rating[]): RatingEntity[] {
        if (!ratings) {
            return undefined
        }
        return ratings.map(it => this.toRatingEntity(it));
    }

}