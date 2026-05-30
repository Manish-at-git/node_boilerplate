import type { Response } from 'express';

const ApiResponse = {
  success(res: Response, data: unknown, statusCode = 200, message = 'Success') {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error(res: Response, statusCode = 500, message = 'Internal server error') {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
    });
  },
};

export default ApiResponse;