import { Parent } from "../parent/parent";
import { Person } from "../@shared/person";
import { StudentValidator } from "./student.validator";
import { Rating } from "../rating/rating";
import { Class } from "../class/class";
import { StudentEntity } from "@/infrastructure/entities/student/student.entity";
import { ParentMapper } from "@/infrastructure/mappers/parent/parent-mapper";

export class Student extends Person {
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

        super({
            name: params.name,
            birthday: params.birthday,
            id: params.id,
            createdAt: params.createdAt,
            updatedAt: params.updatedAt,
            deletedAt: params.deletedAt
        });
        this.enrolled = params.enrolled;
        this.parents = params.nameParents ? Student.createMyParents(params.nameParents) : null;
        this.validate();
    }

    validate(): void {
        new StudentValidator().validate(this);
    }

    getParents(): Parent[] {
        return this.parents
    }

    setParents(parent: Parent) {
        if (!this.parents) {
            this.parents = [];
        }
        this.parents.push(parent);
    }

    getEnrolled(): string {
        return this.enrolled;
    }

    setEnrolled(enrolled: string) {
        this.enrolled = enrolled;
    }

    getRating(): Rating[] {
        return this.ratings;
    }

    getSchoolGroup(): Class {
        return this.schoolGroup;
    }

    setSchoolGroup(schoolGroup: Class) {
        this.schoolGroup = schoolGroup;
    }

    static createMyParent(nameParent: string): Parent {
        return new Parent({
            name: nameParent,
            nameStudents: [this.name]
        });
    }

    static createMyParents(nameParents: string[]): Parent[] {
        if (nameParents.length == 0) return [];
        let parents = [];
        nameParents.forEach(it => {
            parents.push(Student.createMyParent(it));
        })
        return parents;
    }

}
