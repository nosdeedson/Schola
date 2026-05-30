import { BadRequestException, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { mockSystemError } from '../../../../tests/mocks/system-error/system-error-mock';
import { ExceptionHandler } from './exception-handler';

describe('ExcptionHandler', () => {
  it('should be defined', () => {
    expect(new ExceptionHandler()).toBeDefined();
  });

  it('should return an InternalServerErrorException', async () => {
    const error = mockSystemError();
    expect(() => ExceptionHandler.exceptionHandler(error)).toThrow(InternalServerErrorException);
    expect(() => ExceptionHandler.exceptionHandler(error)).toThrow("any message");
  });

  it('should return an UnprocessableEntityException', async () => {
    const error = mockSystemError({ statusCode: 422, context: 'class', message: "was not able to instantite the class domain entity" });
    expect(() => ExceptionHandler.exceptionHandler(error)).toThrow(UnprocessableEntityException);
    expect(() => ExceptionHandler.exceptionHandler(error)).toThrow("was not able to instantite the class domain entity");
  });

  it('should return an NotFoundException', async () => {
    const error = mockSystemError({ statusCode: 404, context: 'class', message: "class not found" });
    expect(() => ExceptionHandler.exceptionHandler(error)).toThrow(NotFoundException);
    expect(() => ExceptionHandler.exceptionHandler(error)).toThrow("class not found");
  });

  it('should return an BadGatewayException', async () => {
    const error = mockSystemError({ statusCode: 400, context: 'class', message: "name of class id required" });
    expect(() => ExceptionHandler.exceptionHandler(error)).toThrow(BadRequestException);
    expect(() => ExceptionHandler.exceptionHandler(error)).toThrow("name of class id required");
  });
});
