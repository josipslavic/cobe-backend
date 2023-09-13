import { Response } from 'express';
import { statusCodes } from './statusCodes';
import * as MESSAGES from './messages';

export const successResponses = {
  deleteSuccess: (res: Response) =>
    res.status(statusCodes.ok).json({ message: MESSAGES.DELETE_SUCCESS }),
};
