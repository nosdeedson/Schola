import { AcademicSemester } from "src/domain/academc-semester/academic.semester";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { QuarterEntity } from "../quarter/quarter.entity";


@Entity("academic_semester")
export class AcademicSemesterEntity extends GenericEntity {

    private constructor() { 
        super();
    }

    @Column({
        nullable: false,
        name: 'actual',
    })
    current: boolean;

    @OneToMany(() => QuarterEntity, quarter => quarter.semester, {
        cascade: true
    })
    @JoinColumn({name: "id_quarter"})
    quarters: QuarterEntity[];


    static toEntity(semester: AcademicSemester): AcademicSemesterEntity{
        const entity = new AcademicSemesterEntity();
        entity.quarters = [];
        entity.id = semester.getId();
        entity.quarters.push(QuarterEntity.toEntity(semester.firstQuarter, 1));
        entity.quarters.push(QuarterEntity.toEntity(semester.secondQuarter, 2));
        entity.current = semester.currentSemester;
        return entity;
    }

}