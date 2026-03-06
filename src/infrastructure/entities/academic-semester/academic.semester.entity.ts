import { AcademicSemester } from "src/domain/academc-semester/academic.semester";
import { Column, Entity, OneToMany } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { RatingEntity } from "../rating/rating.entity";


@Entity("academic_semester")
export class AcademicSemesterEntity extends GenericEntity {

    private constructor() { super() }

    @Column({
        nullable: false,
        name: 'actual',
    })
    actual: boolean;

    @Column({
        nullable: false,
        name: 'beginning_date',
        type: 'timestamp with time zone'
    })
    beginningDate: Date;

    @Column({
        nullable: false,
        name: 'ending_date'
    })
    endingDate: Date;

    @OneToMany(() => RatingEntity, rating => rating.academicSemester)
    ratings: RatingEntity[];
    // TODO FIX
    // static toAcademicSemester(semester: AcademicSemester): AcademicSemesterEntity {
    //     let model = new AcademicSemesterEntity();
    //     model.actual = semester.getActual();
    //     model.beginningDate = semester.getBeginningDate();
    //     model.createdAt = semester.getCreatedAt();
    //     model.deletedAt = semester.getDeletedAt();
    //     model.endingDate = semester.getEndingDate();
    //     model.id = semester.getId();
    //     model.updatedAt = semester.getUpdatedAt()
    //     model.ratings = RatingEntity.toRatingsEntity(semester.getRating());

    //     return model;
    // }

}