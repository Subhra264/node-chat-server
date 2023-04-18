import {
  loadPackageDefinition,
  ServerCredentials,
  Server,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import path from 'path';
import { ProtoGrpcType } from './grpc/models/message';
import MessageReqHandlers from './grpc/reqHandlers/MessageReqHandler';
import { loaderOptions } from './grpc/GRPCClient';
import GRPCGroupClient from './grpc/GRPCGroupClient';

if (process.env.NODE_ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 52051;
const server = new Server({
  'grpc.max_receive_message_length': -1,
  'grpc.max_send_message_length': -1,
});

const PROTO_FILE = '../proto/message.proto';

const packageDef = loadSync(path.resolve(__dirname, PROTO_FILE), loaderOptions);
const proto = loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;

GRPCGroupClient.client.loadProto();

server.addService(proto.message.Message.service, {
  saveFriendMessage: MessageReqHandlers.saveFriendMessage,
  saveGroupMessage: MessageReqHandlers.saveGroupMessage,
});

server.bindAsync(
  `0.0.0.0:${PORT}`,
  ServerCredentials.createInsecure(),
  (err: Error | null, _bindPort: number) => {
    if (err) throw err;

    server.start();
  },
);
