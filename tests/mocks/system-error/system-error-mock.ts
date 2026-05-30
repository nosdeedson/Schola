import { SystemError } from "@/application/services/@shared/system-error";

export type NotificationErrorPropsMock = {
    message?: string;
    context?: string;
    statusCode?: number;
}

export function mockSystemError(
    overrides: NotificationErrorPropsMock = {}
): SystemError {
    const context = overrides.context ?? "any context";
    const message = overrides.message ?? "any message";
    const statusCode = overrides.statusCode ?? 500;
    return new SystemError([
        { context: context, message: message }
    ], statusCode);
}
