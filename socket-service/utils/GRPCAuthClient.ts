import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

const loaderOptions: protoLoader.Options = {
  enums: String,
  longs: String,
  keepCase: true,
  defaults: true,
  oneofs: true,
};

const PROTO_FILE = '../proto/*.proto';
const GRPC_AUTH_SERVER_PORT = process.env.GRPC_AUTH_SERVER_PORT || 50051;

class GRPCAuthClient {
  private client_: grpc.GrpcObject | null;
  private static authClient: GRPCAuthClient;

  private constructor() {
    this.client_ = null;
    this.loadProto();
  }

  private loadProto() {
    const packageDef = protoLoader.loadSync(
      path.resolve(__dirname, PROTO_FILE),
      loaderOptions,
    );

    const proto = grpc.loadPackageDefinition(packageDef);

    this.client_ = proto.auth.Auth.service(
      `0.0.0.0:${GRPC_AUTH_SERVER_PORT}`,
      grpc.credentials.createInsecure(),
    );
  }

  public validateToken(token: string) {}

  public static get client() {
    if (!this.authClient) this.authClient = new GRPCAuthClient();
    return this.authClient.client_;
  }
}

export default GRPCAuthClient;
