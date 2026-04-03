import { Notification, NotificationErrorProps } from "@/domain/@shared/notification/notification";

export class SystemError{
    errors: NotificationErrorProps[] = [];

    constructor(errors: NotificationErrorProps[]){
        this.errors = errors;
    }
}