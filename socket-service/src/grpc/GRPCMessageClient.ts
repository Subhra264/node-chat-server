import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path, { resolve } from 'path';
import {
  GRPC_CLIENT_NOT_READY,
  GRPC_NO_RESPONSE,
  loaderOptions,
} from './GRPCClient';
import { MessageClient } from './models/message/Message';
import { ProtoGrpcType } from './models/message';
import { FriendMessageRequest__Output } from './models/message/FriendMessageRequest';
import { GroupMessageRequest__Output } from './models/message/GroupMessageRequest';
import { GroupMessageResponse__Output } from './models/message/GroupMessageResponse';
import { FriendMessageResponse__Output } from './models/message/FriendMessageResponse';

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

  public async saveFriendMessage(msg: FriendMessageRequest__Output) {
    return new Promise(
      (resolve: (data: FriendMessageResponse__Output) => void, reject) => {
        if (this.isConnected()) return reject(new Error(GRPC_CLIENT_NOT_READY));
        this.grpcClient?.saveFriendMessage(msg, (err, data) => {
          if (err) return reject(new Error(err.message));
          if (!data || data.status !== 'success')
            return reject(new Error(GRPC_NO_RESPONSE));
          resolve(data);
        });
      },
    );
  }

  public async saveGroupMessage(msg: GroupMessageRequest__Output) {
    return new Promise(
      (resolve: (data: GroupMessageResponse__Output) => void, reject) => {
        if (this.isConnected()) return reject(new Error(GRPC_CLIENT_NOT_READY));
        this.grpcClient?.saveGroupMessage(msg, (err, data) => {
          if (err) return reject(new Error(err.message));
          if (!data || data.status !== 'success')
            return reject(new Error(GRPC_NO_RESPONSE));
          resolve(data);
        });
      },
    );
  }
}

export default GRPCMessageClient;
