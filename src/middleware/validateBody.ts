import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import * as ERROR_MESSAGES from '../constants/error-messages';

export function validateBody<T extends object>(
  targetClass: ClassConstructor<T>,
  makeAllOptional?: boolean
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = plainToClass(targetClass, req.body);
    const validationErrors = await validate(data as object, {
      whitelist: true,
      skipMissingProperties: makeAllOptional,
    });
    if (makeAllOptional && Object.keys(data).length === 0)
      // TODO: We don't need to compare length with 0
      return res.status(400).json({
        errors: [ERROR_MESSAGES.NO_VALUES_PROVIDED],
      });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        errors: validationErrors.flatMap((error) =>
          Object.values(error.constraints as { [key: string]: string })
        ),
      });
    }
    req.body = data;
    next();
  };
}
