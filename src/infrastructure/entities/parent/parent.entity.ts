import { Parent } from "../../../domain/parent/parent";
import { Student } from "../../../domain/student/student";
import { ChildEntity, JoinColumn, ManyToMany, OneToMany } from "typeorm";
import { PersonEntity } from "../@shared/person.entity";
import { StudentEntity } from "../student/student.entity";
import { ParentStudentEntity } from "../parent-student/parent.student.entity";


@ChildEntity('parent')
export class ParentEntity extends PersonEntity {

    constructor() { super() }

    @OneToMany(() => ParentStudentEntity, ps => ps.parent)
    parentStudents: ParentStudentEntity[];

    static toParentEntity(parent: Parent): ParentEntity {
        let model = new ParentEntity();
        model.birthday = parent.getBirthday();
        model.createdAt = parent.getCreatedAt();
        model.deletedAt = parent.getDeletedAt();
        model.fullName = parent.getName();
        model.id = parent.getId();
        model.updatedAt = parent.getUpdatedAt();
        return model;
    }

    static toParentsModels(parents: Parent[]): ParentEntity[] {
        let models = parents.map(it => this.toParentEntity(it));
        return models;
    }

}