import { Entity } from "../@shared/entity";
import { Person } from "../@shared/person";
import { AccessType } from "./access.type";
import { UserValidator } from "./user.validator";

export class User extends Entity {

    private readonly person: Person;
    private readonly email: string;
    private nickname: string;
    private readonly password: string;
    private readonly accessType: AccessType;

    constructor(
        person: Person,
        email: string,
        nickname: string,
        password: string,
        accessType: AccessType,
        id?: string, 
        createdAt?: Date, 
        updatedAt?: Date, 
        deletedAt?: Date
    ){
        super(id, createdAt, updatedAt, deletedAt)
        this.person = person;
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.accessType = accessType;
        this.validate();
    }

    validate(){
        new UserValidator().validate(this);
    }

    getPerson(): Person {
        const person = this.person;
        return person;
    }

    getEmail(): string{
        const email = this.email;
        return email;
    }

    getNickname(): string{
        const nickname = this.nickname;
        return nickname;
    }

    setNickanme(nickname: string) {
        this.nickname = nickname;
    }

    getAccessType(): AccessType{
        const accessType = this.accessType;
        return accessType;
    }

    getPassword(): string{
        const password = this.password;
        return password
    }

}