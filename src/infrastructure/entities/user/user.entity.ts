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
    accesType: AccessType;

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

    static toUserEntity(user: User): UserEntity {
        let userModel = new UserEntity();
        userModel.createdAt = user.getCreatedAt();
        userModel.deletedAt = user.getDeletedAt();
        userModel.email = user.getEmail();
        userModel.id = user.getId();
        userModel.password = user.getPassword();
        if (user.getAccessType() == AccessType.ADMIN) {
            userModel.person = new WorkerUserconverter().converter(user.getPerson() as Worker);
        } else if (user.getAccessType() == AccessType.PARENT) {
            userModel.person = new ParentUserConverter().converter(user.getPerson() as Parent);
        } else if (user.getAccessType() == AccessType.STUDENT) {
            userModel.person = new StudentUserConverter().converter(user.getPerson() as Student);
        } else if (user.getAccessType() == AccessType.TEACHER) {
            let teacher = user.getPerson() as Worker;
            let schoolGroups = teacher.getClasses();
            let modelOfClass = null;
            if (schoolGroups) {
                modelOfClass = ClassEntity.toClassEntity(schoolGroups[0])
            }
            userModel.person = new WorkerUserconverter().converter(teacher, modelOfClass);
        } else {
            throw new Error("access type does not exist")
        }
        userModel.updatedAt = user.getUpdatedAt();
        userModel.accesType = user.getAccessType();
        userModel.nickname = user.getNickname();

        return userModel;
    }

}
