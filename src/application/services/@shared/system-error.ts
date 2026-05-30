import { Notification, NotificationErrorProps } from "@/domain/@shared/notification/notification";

export class SystemError {
    errors: NotificationErrorProps[] = [];
    statusCode: number;

    constructor(errors: NotificationErrorProps[], statusCode: number) {
        this.errors = errors;
        this.statusCode = statusCode;
    }
}
