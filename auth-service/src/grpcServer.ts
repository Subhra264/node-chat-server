import { Server, ServerCredentials } from '@grpc/grpc-js';

const server = new Server({
  'grpc.max_receive_message_length': -1,
  'grpc.max_send_message_length': -1,
});

// TODO: Add the compiled services

server.bindAsync(
  '0.0.0.0:50051',
  ServerCredentials.createInsecure(),
  (err: Error | null, bindPort: number) => {
    if (err) {
      throw err;
    }

    server.start();
  },
);
