import path from 'path';
import { execSync } from 'child_process';
import rimraf from 'rimraf';

const PROTO_DIR = path.join(__dirname, '../protos');
const MODEL_DIR = path.join(__dirname, '../src/grpc/models');
const PROTOC_PATH = path.join(__dirname, '../node_modules/grpc-tools/bin/protoc');
const PLUGIN_PATH = path.join(__dirname, '../node_modules/.bin/protoc-gen-ts_proto');

rimraf.sync(`${MODEL_DIR}/*`, {
  glob: { ignore: `${MODEL_DIR}/tsconfig.json` },
});

const protoConfig = [
  `--plugin=${PLUGIN_PATH}`,

  // https://github.com/stephenh/ts-proto/blob/main/README.markdown
  "--ts_proto_opt=outputServices=grpc-js,env=node,useOptionals=messages,exportCommonSymbols=false,esModuleInterop=true",

  `--ts_proto_out=${MODEL_DIR}`,
  `--proto_path ${PROTO_DIR} ${PROTO_DIR}/*.proto`,
];

// https://github.com/stephenh/ts-proto#usage
execSync(`${PROTOC_PATH} ${protoConfig.join(" ")}`);
console.log(`> Proto models created: ${MODEL_DIR}`);