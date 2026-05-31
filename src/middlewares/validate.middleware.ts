import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import ApiError from '@/utils/ApiError';
import httpStatus from '@/constants/httpStatus';

const validate = (schema: z.ZodObject<any>) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const { success, error } = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!success) {
            const message = error!.issues.map((e) => e.message).join(', ');
            throw new ApiError(httpStatus.BAD_REQUEST, message);
        }

        next();
    };
};

export default validate;