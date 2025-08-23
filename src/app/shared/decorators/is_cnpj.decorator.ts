import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

import { DocumentValidatorService } from "@shared/validators/document-validator.service";

export function IsCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && DocumentValidatorService.validarCnpj(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CNPJ válido`;
        },
      },
    });
  };
}
