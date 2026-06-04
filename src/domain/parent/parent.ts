import { ParentEntity } from "@/infrastructure/entities/parent/parent.entity";
import { Person } from "../@shared/person";
import { Student } from "../student/student";
import { ParentValidator } from "./parent.validator";

export class Parent extends Person{
    
    private students?: Student[];

    constructor(params:{
        name: string,
        birthday?: Date,
        nameStudents?: string[],
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    }
    ) {
        let {name, birthday, nameStudents, id, createdAt, updatedAt, deletedAt} = params;
        super({name,birthday, id, createdAt, updatedAt, deletedAt, })
        if(nameStudents){
            this.students = Parent.createMyChildren(nameStudents);
            this.validate();
        }
    }

    validate(): void{
        new ParentValidator().validate(this);
    }

    getStudents(): Student[]{
        return this.students;
    }

    setStudents(students: Student[]){
        this.students = students;
    }
    // TODO CREATE A PARENT MAPPER THAT WILL CONVERT DOMAIN TO ENTITY AND VICE-VERSA TO IT FOR ALL
    static toDomain(parentEntity: ParentEntity): Parent {

        let parent = new Parent({
            name: parentEntity.fullName,
            birthday: parentEntity.birthday,
            id: parentEntity.id,
            createdAt: parentEntity.createdAt,
            updatedAt: parentEntity.updatedAt,
            deletedAt: parentEntity.deletedAt,
        });
        return parent;
    }

    static createMyChild(nameStudent: string): Student {
        return new Student({
            birthday: null,
            name: nameStudent,
            enrolled: null,
        });
    }

    static createMyChildren(nameStudents: string[]): Student[] {
        let students = [];
        nameStudents.forEach(it => {
            students.push(this.createMyChild(it));
        })
        return students;
    }
    
}