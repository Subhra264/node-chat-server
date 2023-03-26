import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from '@grpc/grpc-js';
import { loadSync, Options } from '@grpc/proto-loader';
import path from 'path';
import { ProtoGrpcType } from './grpc/models/auth';
import AuthReqHandler from './grpc/reqHandlers/AuthReqHandler';

if (process.env.NODE_ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.GRPC_PORT || 50051;
const server = new Server({
  'grpc.max_receive_message_length': -1,
  'grpc.max_send_message_length': -1,
});

const loaderConfig: Options = {
  enums: String,
  longs: String,
  keepCase: true,
  defaults: true,
  oneofs: true,
};

const PROTO_FILE = '../proto/auth.proto';

const packageDef = loadSync(path.resolve(__dirname, PROTO_FILE), loaderConfig);
const proto = loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;

server.addService(proto.auth.Auth.service, {
  ValidateToken: AuthReqHandler.validateToken,
});

server.bindAsync(
  `0.0.0.0:${PORT}`,
  ServerCredentials.createInsecure(),
  (err: Error | null, bindPort: number) => {
    if (err) {
      throw err;
    }

    server.start();
  },
);
