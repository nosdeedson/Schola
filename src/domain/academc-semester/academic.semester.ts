import { Entity } from "../@shared/entity";
import { AcademicSemesterValidator as AcademicSemesterValidator } from "./academic.semester.validator";
import { Quarter } from "../quarter/quarter";

export class AcademicSemester extends Entity {

    firstQuarter: Quarter;
    secondQuarter: Quarter;
    currentSemester: boolean;

    constructor(
        firstQuarter: Quarter,
        secondQuarter: Quarter,
        currentSemester: boolean,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    ) {
        super(id, createdAt, updatedAt, deletedAt);
        this.firstQuarter = firstQuarter;
        this.secondQuarter = secondQuarter;
        this.currentSemester = currentSemester;
        this.validate();
    }

    validate() {
        new AcademicSemesterValidator().validate(this);
    }

    getFirstQuarter(): Quarter{
        return this.firstQuarter;
    }

    getSecondQuarter(): Quarter{
        return this.secondQuarter;
    } 

    getCurrentSemester(): boolean{
        return this.currentSemester;
    }

}