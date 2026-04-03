import { BadRequestException, NotFoundException } from "@nestjs/common";
import { SystemError } from "@/application/services/@shared/system-error";

export class TrataErros {
    // TODO ADD HTTP STATUS TO SystemError
    static tratarErrorsBadRequest(error: SystemError) {
        error.errors.forEach(element => {
            let errors = []
            error.errors.forEach(element => {
                errors.push(element.message);
            });
            throw new BadRequestException(errors.join());
        });
    }

    static tratarErrorsNotFound(error: SystemError){
        let errors = []
        error.errors.forEach(element => {
            errors.push(element.message);
        })
        throw new NotFoundException(errors.join());
    }

}
