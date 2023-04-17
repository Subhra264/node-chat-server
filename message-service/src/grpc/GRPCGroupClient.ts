import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { loaderOptions } from './GRPCClient';

const PROTO_FILE = '../proto/group.proto';
const GRPC_GROUP_SERVER_PORT = process.env.GRPC_GROUP_SERVER_PORT || 51051;

class GRPCGroupClient {
  private grpcClient: AuthClient | null;
  private isReady: boolean;
  private static client_: GRPCGroupClient;

  private constructor() {
    this.grpcClient = null;
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

    this.grpcClient = new proto.auth.Auth(
      `0.0.0.0:${GRPC_GROUP_SERVER_PORT}`,
      grpc.credentials.createInsecure(),
    );

    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 1);
    this.grpcClient.waitForReady(deadline, (err) => {
      if (err) return console.log('Error setting up the GRPC client...', err);
      this.isReady = true;
    });
  }

  public static get client() {
    if (!this.client_) this.client_ = new GRPCGroupClient();
    return this.client_;
  }
}

export default GRPCGroupClient;
