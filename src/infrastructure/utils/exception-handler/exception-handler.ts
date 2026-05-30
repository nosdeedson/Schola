import { BadRequestException, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { SystemError } from "@/application/services/@shared/system-error";

export class ExceptionHandler {

    static exceptionHandler(error: SystemError) {
        const issues = this.treatErrors(error);
        switch (error.statusCode) {
            case 400:
                throw new BadRequestException(issues);
            case 404:
                throw new NotFoundException(issues);
            case 422:
                throw new UnprocessableEntityException(issues);
            default:
                throw new InternalServerErrorException(issues);
        }
    }

    private static treatErrors(error: SystemError): string {
        let errors = []
        error.errors.forEach(element => {
            error.errors.forEach(element => {
                errors.push(element.message);
            });
        });
        return errors.join(', ');
    }

}
