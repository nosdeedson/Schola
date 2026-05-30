import { SystemError } from "@/application/services/@shared/system-error";
import { NotificationErrorProps } from "@/domain/@shared/notification/notification";

export type NotificationErrorPropsMock = {
    message?: string;
    context?: string;
}

export type SystemErrorMock = {
    errors?: NotificationErrorPropsMock[];
    statusCode?: number;
}

export function mockSystemError(
    overrides: SystemErrorMock = {}
): SystemError {
    const errors = overrides.errors as NotificationErrorProps[]
        ?? [{ context: 'any context', message: 'any message' }];
    const statusCode = overrides.statusCode ?? 500;
    return new SystemError(errors, statusCode);
}
