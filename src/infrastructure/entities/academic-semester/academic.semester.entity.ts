import { AcademicSemester } from "src/domain/academc-semester/academic.semester";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { RatingEntity } from "../rating/rating.entity";
import { QuarterEntity } from "../quarter/quarter.entity";


@Entity("academic_semester")
export class AcademicSemesterEntity extends GenericEntity {

    private constructor() { 
        super();
        this.quarters = [];
    }

    @Column({
        nullable: false,
        name: 'actual',
    })
    current: boolean;

    @OneToOne(() => QuarterEntity, quarter => quarter.semester, {
        cascade: true
    })
    @JoinColumn({name: "id_quarter"})
    quarters: QuarterEntity[];


    static toEntity(semester: AcademicSemester): AcademicSemesterEntity{
        const entity = new AcademicSemesterEntity();
        entity.quarters.push(QuarterEntity.toEntity(semester.firstQuarter));
        entity.quarters.push(QuarterEntity.toEntity(semester.secondQuarter));
        entity.current = semester.currentSemester;
        return entity;
    }

}