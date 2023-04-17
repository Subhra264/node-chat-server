import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ProtoGrpcType } from '../models/auth';
import { AuthClient } from '../models/auth/Auth';
import { ValidateResponse__Output } from '../models/auth/ValidateResponse';
import { loaderOptions } from './GRPCClient';

const PROTO_FILE = '../proto/auth.proto';
const GRPC_AUTH_SERVER_PORT = process.env.GRPC_AUTH_SERVER_PORT || 50051;

class GRPCAuthClient {
  private client_: AuthClient | null;
  private isReady: boolean;
  private static authClient: GRPCAuthClient;

  private constructor() {
    this.client_ = null;
    this.isReady = false;
  }

  public loadProto() {
    const packageDef = protoLoader.loadSync(
      path.resolve(__dirname, PROTO_FILE),
      loaderOptions,
    );

    const proto = grpc.loadPackageDefinition(
      packageDef,
    ) as unknown as ProtoGrpcType;

    this.client_ = new proto.auth.Auth(
      `0.0.0.0:${GRPC_AUTH_SERVER_PORT}`,
      grpc.credentials.createInsecure(),
    );

    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 1);
    this.client_.waitForReady(deadline, (err) => {
      if (err) return console.log('Error setting up the GRPC client...', err);
      this.isReady = true;
    });
  }

  public validateToken(token: string): Promise<ValidateResponse__Output> {
    return new Promise((resolve, reject) => {
      if (!this.client_ || !this.isReady)
        return reject(new Error('GRPC_CLIENT_NOT_READY'));
      this.client_.ValidateToken({ token }, (err, res) => {
        if (err) return reject(new Error(err.name));
        if (!res || res.status !== 'success')
          return reject(new Error('NO_RESPONSE'));
        resolve(res);
      });
    });
  }

  public static get client() {
    if (!this.authClient) this.authClient = new GRPCAuthClient();
    return this.authClient;
  }
}

export default GRPCAuthClient;
