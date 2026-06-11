import { Worker } from "../../../domain/worker/worker";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Parent } from "../../../domain/parent/parent";
import { Student } from "../../../domain/student/student";
import { AccessType } from "../../../domain/user/access.type";
import { User } from "../../../domain/user/user";
import { GenericEntity } from "../@shared/generic.entity/generic.entity";
import { PersonEntity } from "../@shared/person.entity";
import { ParentUserConverter } from "../parent/parent.user.converter";
import { StudentUserConverter } from "../student/student.user.converter";
import { WorkerUserconverter } from "../worker/worker.user.converter";
import { ClassEntity } from "../class/class.entity";
import { ClassMapper } from "@/infrastructure/mappers/schoolgroup/class-mapper";


@Entity('users')
export class UserEntity extends GenericEntity {

    @Column({
        nullable: false,
        name: 'email'
    })
    email: string;

    @Column({
        nullable: false,
        name: 'password',
    })
    password: string;

    @Column({
        nullable: false,
        name: 'access_type'
    })
    accessType: AccessType;

    @Column({
        nullable: false,
        name: 'nickname',
        type: 'varchar',
        length: 50
    })
    nickname: string;

    @OneToOne(() => PersonEntity, { eager: true })
    @JoinColumn({ foreignKeyConstraintName: 'user_person_fk', name: 'person_id', })
    person: PersonEntity;

}
