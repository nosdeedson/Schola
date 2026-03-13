import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { RatingEntity } from "../rating/rating.entity";
import { AcademicSemesterEntity } from "../academic-semester/academic.semester.entity";
import { Quarter } from "src/domain/quarter/quarter";

@Entity('quarter')
export class QuarterEntity extends GenericEntity {

    @Column({
        name: 'beggining_date',
        type: 'timestamp with time zone',
        nullable: false,
    })
    beginningDate: Date;

    @Column({
        name: 'ending_date',
        type: 'timestamp with time zone',
        nullable: false,
    })
    endingDate: Date;

    @Column({
        name: 'current',
        nullable: false,
        default: false
    })
    currentQuarter: boolean;

    @Column({
        name: 'quarter_number',
        nullable: false,
        type: 'int'
    })
    quarter_number: number;

    @OneToMany(() => RatingEntity, rating => rating.academicSemester)
    ratings?: RatingEntity[];

    @ManyToOne(() => AcademicSemesterEntity, semester => semester.quarters)
    @JoinColumn({name: 'semester_id'})
    semester: AcademicSemesterEntity;

    static toEntity(quarter: Quarter): QuarterEntity {
        let entity = new QuarterEntity();
        entity.beginningDate = quarter.beginningDate;
        entity.endingDate = quarter.endingDate;
        entity.currentQuarter = quarter.currentQuarter;
        return entity;
    }
}