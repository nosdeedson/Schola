import { ChildEntity, Column, JoinColumn, OneToMany } from "typeorm";
import { RoleEnum } from "../../../domain/worker/roleEnum";
import { Worker } from "../../../domain/worker/worker";
import { PersonEntity } from "../@shared/person.entity";
import { ClassEntity } from "../class/class.entity";

@ChildEntity('worker')
export class WorkerEntity extends PersonEntity {

    constructor() {
        super();
    }

    @Column({
        nullable: true,
        type: 'enum',
        enum: [
            RoleEnum.ADMINISTRATOR,
            RoleEnum.TEACHER
        ]
    })
    role: RoleEnum;

    @OneToMany(() => ClassEntity, (classes) => classes.teacher)
    classes: ClassEntity[];
}
