import { Column, Entity, OneToMany } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { RatingEntity } from "../rating/rating.entity";

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

    @OneToMany(() => RatingEntity, rating => rating.academicSemester)
    ratings?: RatingEntity[];
}