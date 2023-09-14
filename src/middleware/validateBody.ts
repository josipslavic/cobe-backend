import { ClassConstructor, plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'

import { commonErrors } from '../constants/commonErrors'
import { statusCodes } from '../constants/statusCodes'

export function validateBody<T extends object>(
  targetClass: ClassConstructor<T>,
  makeAllOptional?: boolean
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = plainToClass(targetClass, req.body)
      const validationErrors = await validate(data as object, {
        whitelist: true,
        skipMissingProperties: makeAllOptional,
      })
      if (makeAllOptional && !Object.keys(data).length)
        throw commonErrors.noValuesProvided
      if (validationErrors.length > 0) {
        return res.status(statusCodes.badRequest).json({
          success: false,
          statusCode: statusCodes.badRequest,
          message: validationErrors.flatMap((error) =>
            Object.values(error.constraints as { [key: string]: string })
          ),
        })
      }
      req.body = data
      next()
    } catch (error) {
      next(error)
    }
  }
}
