import { Worker } from "@/domain/worker/worker";

export class UpdateClassDto{
    id: string;
    nameBook: string;
    teacher: Worker;

    constructor(
        id: string,
        nameBook: string,
        teacher: Worker,
    ){
        this.nameBook = nameBook;
        this.teacher = teacher;
        this.id = id;
    }
}