import { v4 as uuidv4 } from 'uuid';
import { Notification } from './notification/notification';


export abstract class Entity {
    private id?: string;
    private createdAt?: Date;
    private updatedAt?: Date;
    private deletedAt?: Date;
    private _notification?: Notification;

    constructor(id?: string, createdAt?: Date, updatedAt?: Date, deletedAt?: Date) {
        this.id = id ? id : uuidv4().toString() as string;
        this.createdAt = createdAt ? createdAt : new Date();
        this.updatedAt = updatedAt ? updatedAt : new Date();
        this.deletedAt = deletedAt;
        this._notification = new Notification();
    }

    getId(): any {
        return this.id;
    }

    getCreatedAt(): any {
        return this.createdAt;
    }

    getUpdatedAt(): any {
        return this.updatedAt;
    }

    setUpdatedAt(updatedAt: Date) {
        this.updatedAt = updatedAt;
    }

    getDeletedAt(): any {
        return this.deletedAt;
    }

    get notification(): any {
        return this._notification;
    }
}
