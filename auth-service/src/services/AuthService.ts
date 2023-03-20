import convertToHttpErrorFrom from '../errors/errorsToHttpError';
import { TokenKeyType, verifyToken } from '../utils/jwt';

export default {
  validateToken: async (token: string) => {
    try {
      return await verifyToken(token, TokenKeyType.JWT_ACCESS_KEY);
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },
};
