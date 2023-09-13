import { Response } from 'express';
import { statusCodes } from './statusCodes';
import * as MESSAGES from './messages';

export const successResponses = {
  ok: (res: Response, payload: any) => res.status(statusCodes.ok).json(payload),
  created: (res: Response, payload: any) =>
    res.status(statusCodes.created).json(payload),
};
