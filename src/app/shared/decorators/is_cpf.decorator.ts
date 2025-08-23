import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

import { DocumentValidatorService } from "@shared/validators/document-validator.service";

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && DocumentValidatorService.validarCpf(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF válido`;
        },
      },
    });
  };
}
