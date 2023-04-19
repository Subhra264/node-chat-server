import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path, { resolve } from 'path';
import {
  GRPC_CLIENT_NOT_READY,
  GRPC_NO_RESPONSE,
  loaderOptions,
} from './GRPCClient';
import { GroupClient } from './models/group/Group';
import { ProtoGrpcType } from './models/group';
import { MembersResponse__Output } from './models/group/MembersResponse';
import { GroupExistResponse__Output } from './models/group/GroupExistResponse';

const PROTO_FILE = '../proto/group.proto';
const GRPC_GROUP_SERVER_PORT = process.env.GRPC_GROUP_SERVER_PORT || 51051;

class GRPCGroupClient {
  private grpcClient: GroupClient | null;
  private isReady: boolean;
  private static client_: GRPCGroupClient;

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

      this.grpcClient = new proto.group.Group(
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
  }

  public static get client() {
    if (!this.client_) this.client_ = new GRPCGroupClient();
    return this.client_;
  }

  private isConnected() {
    return this.isReady && this.grpcClient;
  }

  public async getMembers(groupId: string) {
    return new Promise(
      (resolve: (data: MembersResponse__Output) => void, reject) => {
        if (!this.isConnected()) {
          return reject(new Error(GRPC_CLIENT_NOT_READY));
        }
        this.grpcClient?.getMembers(
          {
            groupId,
          },
          (err, data) => {
            if (err) return reject(new Error(err.message));
            if (!data || data.status !== 'success')
              return reject(new Error(GRPC_NO_RESPONSE));
            resolve(data);
          },
        );
      },
    );
  }

  public async doesGroupExist(groupId: string) {
    return new Promise(
      (resolve: (data: GroupExistResponse__Output) => void, reject) => {
        if (!this.isConnected()) {
          return reject(new Error(GRPC_CLIENT_NOT_READY));
        }
        this.grpcClient?.doesGroupExist(
          {
            groupId,
          },
          (err, data) => {
            if (err) return reject(new Error(err.message));
            if (!data || data.status !== 'success')
              return reject(new Error(GRPC_NO_RESPONSE));
            resolve(data);
          },
        );
      },
    );
  }
}

export default GRPCGroupClient;
