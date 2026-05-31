import { Notification } from "./notification"

describe('Notification error unit test', () => {

    it('should create errors', () => {
        const notification = new Notification();

        const error = {
            message: "error message",
            context: "student"
        }

        expect(notification.addError(error)).toBe(void 0);
        expect(notification.messages('student')).toBe("student: error message,")

        const error1 = {
            message: "another message",
            context: 'student'
        }
        notification.addError(error1)

        expect(notification.messages('student')).toBe('student: error message,student: another message,')

        const error2 = {
            message: "error message",
            context: "teacher"
        }
        notification.addError(error2)
        expect(notification.messages('teacher')).toBe('teacher: error message,');
        expect(notification.hasError()).toBeTruthy()
        expect(notification.getErrors().length).toBe(3)
    });

    it('should get messages not passing context', () => {
        const notification = new Notification();

        const error = {
            message: "error message",
            context: "student"
        }
        notification.addError(error)
        expect(notification.messages()).toBe('student: error message,')
    });


    it('notification should have 2 errors', () => {
        const notification = new Notification();

        const error = {
            message: "error message",
            context: "student"
        }

        notification.addError(error);

        const error1 = {
            message: "another message",
            context: 'student'
        }
        notification.addError(error1)

        const error2 = {
            message: "error message",
            context: "teacher"
        }
        notification.addError(error2)

        expect(notification.hasError()).toBeTruthy()
        expect(notification.getErrors().length).toBe(3)
    });

})
