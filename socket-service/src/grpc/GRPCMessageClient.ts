import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { loaderOptions } from './GRPCClient';
import { MessageClient } from './models/message/Message';
import { ProtoGrpcType } from './models/message';

const PROTO_FILE = '../proto/message.proto';
const GRPC_MESSAGE_SERVER_PORT = process.env.GRPC_GROUP_SERVER_PORT || 52051;

class GRPCMessageClient {
  private grpcClient: MessageClient | null;
  private isReady: boolean;
  private static client_: GRPCMessageClient;

  private constructor() {
    this.grpcClient = null;
    this.isReady = false;
  }

  public loadProto() {
    if (!this.grpcClient) {
      const packageDef = protoLoader.loadSync(
        path.resolve(__dirname, PROTO_FILE),
        loaderOptions,
      );

      const proto = grpc.loadPackageDefinition(
        packageDef,
      ) as unknown as ProtoGrpcType;

      this.grpcClient = new proto.message.Message(
        `0.0.0.0:${GRPC_MESSAGE_SERVER_PORT}`,
        grpc.credentials.createInsecure(),
      );

      const deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 1);
      this.grpcClient.waitForReady(deadline, (err) => {
        if (err) return console.log('Error setting up the GRPC client...', err);
        this.isReady = true;
      });
    }
  }

  public static get client() {
    if (!this.client_) this.client_ = new GRPCMessageClient();
    return this.client_;
  }

  private isConnected() {
    return this.isReady && this.grpcClient;
  }
}

export default GRPCMessageClient;
