import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { AcademicSemesterEntity } from "../academic-semester/academic.semester.entity";
import { Quarter } from "@/domain/quarter/quarter";
import { RatingEntity } from "../rating/rating.entity";

@Index(
    'unique_current_quarter',
    ['currentQuarter'],
    {
        unique: true,
        where: '"current_quarter" = true'
    }
)
@Entity('quarter')
export class QuarterEntity extends GenericEntity {

    @Column({
        name: 'begining_date',
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
        name: 'current_quarter',
        nullable: false,
        default: false
    })
    currentQuarter: boolean;

    @Column({
        name: 'quarter_number',
        nullable: false,
        type: 'int'
    })
    quarterNumber: number;

    @OneToMany(() => RatingEntity, rating => rating.quarter)
    ratings?: RatingEntity[];

    @ManyToOne(() => AcademicSemesterEntity, semester => semester.quarters)
    @JoinColumn({ name: 'semester_id' })
    semester: AcademicSemesterEntity;

}
