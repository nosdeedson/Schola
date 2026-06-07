import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { QuarterEntity } from "../quarter/quarter.entity";

@Entity("academic_semester")
export class AcademicSemesterEntity extends GenericEntity {

    @Column({
        nullable: false,
        name: 'current',
    })
    current: boolean;

    @OneToMany(() => QuarterEntity, quarter => quarter.semester, {
        cascade: true
    })
    quarters: QuarterEntity[];

}
