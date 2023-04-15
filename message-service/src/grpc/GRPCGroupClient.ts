import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path, { resolve } from 'path';
import { ProtoGrpcType } from '../models/auth';
import { AuthClient } from '../models/auth/Auth';
import { ValidateResponse__Output } from '../models/auth/ValidateResponse';
import { loaderOptions } from './GRPCClient';

const PROTO_FILE = '../proto/group.proto';
const GRPC_GROUP_SERVER_PORT = process.env.GRPC_GROUP_SERVER_PORT || 51051;

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
      `0.0.0.0:${GRPC_GROUP_SERVER_PORT}`,
      grpc.credentials.createInsecure(),
    );

    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 1);
    this.client_.waitForReady(deadline, (err) => {
      if (err) return console.log('Error setting up the GRPC client...', err);
      this.isReady = true;
    });
  }

  public static get client() {
    if (!this.authClient) this.authClient = new GRPCAuthClient();
    return this.authClient;
  }
}

export default GRPCAuthClient;
