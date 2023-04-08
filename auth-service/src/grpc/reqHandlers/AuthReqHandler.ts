import grpc from '@grpc/grpc-js';
import AuthService from '../../services/AuthService';
import { ValidateRequest__Output } from '../models/auth/ValidateRequest';
import { ValidateResponse } from '../models/auth/ValidateResponse';

interface AuthPayload {
  userId: string;
  username: string;
}

export default {
  validateToken: async (
    req: grpc.ServerUnaryCall<ValidateRequest__Output, ValidateResponse>,
    res: grpc.sendUnaryData<ValidateResponse>,
  ) => {
    try {
      if (!req.request.token) throw new Error('Token required!');
      const payload = (await AuthService.validateToken(
        req.request.token,
      )) as unknown as AuthPayload;

      res(null, {
        status: 'success',
        userId: payload.userId,
        username: payload.username,
      });
    } catch (err: any) {
      res({
        code: grpc.status.INTERNAL,
        message: err.message,
      });
    }
  },
};
