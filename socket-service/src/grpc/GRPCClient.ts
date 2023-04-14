import { Options } from '@grpc/proto-loader';

export const loaderOptions: Options = {
  enums: String,
  longs: String,
  keepCase: true,
  defaults: true,
  oneofs: true,
};
