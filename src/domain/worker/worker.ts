import { Person } from "../@shared/person";
import { Class } from "../class/class";
import { RoleEnum } from "./roleEnum";
import { WorkerValidator } from "./worker.validator";
import { AccessType } from "../user/access.type";
import { WorkerEntity } from "@/infrastructure/entities/worker/worker.entity";

export class Worker extends Person {

    private role: RoleEnum;
    private classes: Class[]

    constructor(params: {
        birthday?: Date,
        name: string,
        role: RoleEnum,
        id?: string,
        createdAt?: Date,
        updatedAt?: Date,
        deletedAt?: Date,
    }) {
        super({
            birthday: params.birthday, 
            name: params.name, 
            id: params.id, 
            createdAt: params.createdAt, 
            updatedAt: params.updatedAt, 
            deletedAt: params.deletedAt});
        this.role = params.role;
        this.validate();
    }

    validate() {
        new WorkerValidator().validate(this);
    }

    getRole(): RoleEnum {
        return this.role;
    }

    setRole(role: RoleEnum) {
        this.role = role;
    }

    getClasses(): Class[] {
        return this.classes;
    }

    setClass(c: Class) {
        if (!this.classes) {
            this.classes = [];
        }
        this.classes.push(c);
    }

    static toDomain(person: WorkerEntity, accessType: AccessType): Worker{
        if (AccessType.ADMIN == accessType || AccessType.TEACHER == accessType) {
            return new Worker({
                birthday: person.birthday,
                name: person.fullName,
                role: person.role,
                id: person.id,
                createdAt: person.createdAt,
                updatedAt: person.updatedAt,
                deletedAt: person.deletedAt
            });
        }
    }

}