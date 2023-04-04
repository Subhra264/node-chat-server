import {
  loadPackageDefinition,
  ServerCredentials,
  Server,
} from '@grpc/grpc-js';
import { Options, loadSync } from '@grpc/proto-loader';
import path from 'path';
import { ProtoGrpcType } from './grpc/models/group';
import GroupReqHandlers from './grpc/reqHandlers/GroupReqHandlers';

if (process.env.NODE_ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 51051;
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

const PROTO_FILE = '../proto/group.proto';

const packageDef = loadSync(path.resolve(__dirname, PROTO_FILE), loaderConfig);
const proto = loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;

server.addService(proto.group.Group.service, {
  getMembers: GroupReqHandlers.getMembersHandler,
  doesGroupExist: GroupReqHandlers.doesExist,
});

server.bindAsync(
  `0.0.0.0:${PORT}`,
  ServerCredentials.createInsecure(),
  (err: Error | null, _bindPort: number) => {
    if (err) throw err;

    server.start();
  },
);
