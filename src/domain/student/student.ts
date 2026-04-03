import { Parent } from "../parent/parent";
import { Person } from "../@shared/person";
import { StudentValidator } from "./student.validator";
import { Rating } from "../rating/rating";
import { Class } from "../class/class";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";

export class Student extends Person {
   
    // TODO create code to generate enrolled code

    private enrolled: string;
    private parents?: Parent[];
    private ratings: Rating[];
    private schoolGroup: Class;

    constructor(params: {
        nameParents?: string[],
        birthday?: Date,
        name: string,
        enrolled?: string,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    }) {

        super( {
            name: params.name, 
            birthday: params.birthday, 
            id: params.id, 
            createdAt: params.createdAt, 
            updatedAt: params.updatedAt, 
            deletedAt: params.deletedAt
        });
        this.enrolled = params.enrolled;
        if(params.nameParents){
            this.parents= Student.createMyParents(params.nameParents);
            this.validate();
        }
    }

    validate(): void{
        new StudentValidator().validate(this);
    }

    getParents(): Parent[] {
        return this.parents
    }

    setParents(parent: Parent){
        if(!this.parents){
            this.parents = [];
        }
        this.parents.push(parent);
    }

    getEnrolled(): string {
        return this.enrolled;
    }

    getRating(): Rating[]{
        return this.ratings;
    }

    getSchoolGroup(): Class{
        return this.schoolGroup;
    }

    setSchoolGroup(schoolGroup: Class){
        this.schoolGroup = schoolGroup;
    }

    static toDomain(entity: StudentEntity): Student {
        let parents = [];
        if(entity.parents && entity?.parents.length > 0){
            entity.parents.forEach(it => {
                parents.push(Parent.toDomain(it));
            })
        }
        let student = new Student({
            nameParents: parents.map(it => it.getName()),
            birthday: entity.birthday,
            name: entity.fullName,
            enrolled: entity.enrolled,
            id: entity.id,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            deletedAt: entity.deletedAt,
        });
        parents.forEach(it => {
            student.setParents(it);
        });
        return student;
    }

    static createMyParent(nameParent: string): Parent{
        return new Parent({
            name: nameParent,
            nameStudents: [this.name]
        });
    }

    static createMyParents(nameParents: string[]): Parent[]{
        let parents = [];
        nameParents.forEach(it => {
            parents.push(Student.createMyParent(it));
        })
        return parents;
    }

}