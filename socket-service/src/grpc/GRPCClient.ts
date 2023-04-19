import { Options } from '@grpc/proto-loader';

export const loaderOptions: Options = {
  enums: String,
  longs: String,
  keepCase: true,
  defaults: true,
  oneofs: true,
};

export const GRPC_CLIENT_NOT_READY = 'GRPC_CLIENT_NOT_READY';
export const GRPC_NO_RESPONSE = 'GRPC_NO_RESPONSE';
