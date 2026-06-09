
import { Request, Response, NextFunction } from "express";
import ApiError from "@/utils/ApiError";
import httpStatus from "@/constants/httpStatus";

const authorize = (roles: string[]) => {
    return (
        req: Request,
        _res: Response,
        next: NextFunction,
    ): void => {
        if (!req.user) {
            throw new ApiError( httpStatus.UNAUTHORIZED, "Unauthorized" );
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError( httpStatus.FORBIDDEN, "Forbidden" );
        }

        next();
    };
};

export default authorize;