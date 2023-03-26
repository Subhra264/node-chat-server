import path from 'path';
import { execSync } from 'child_process';
import rimraf from 'rimraf';

const PROTO_DIR = path.join(__dirname, '../proto');
const MODEL_DIR = path.join(__dirname, '../src/grpc/models');
const PROTO_LOADER_PATH = path.join(
  __dirname,
  '../node_modules/.bin/proto-loader-gen-types',
);

rimraf.sync(`${MODEL_DIR}/*`, {
  glob: { ignore: `${MODEL_DIR}/.gitignore` },
});

const protoConfig = [
  '--enums=String',
  '--longs=String',
  `--outDir=${MODEL_DIR}`,
  '--grpcLib=@grpc/grpc-js',
  `proto/auth.proto`,
];

execSync(`${PROTO_LOADER_PATH} ${protoConfig.join(' ')}`);
console.log(`> Proto models created: ${MODEL_DIR}`);
