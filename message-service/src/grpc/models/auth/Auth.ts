// Original file: proto/auth.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ValidateRequest as _auth_ValidateRequest, ValidateRequest__Output as _auth_ValidateRequest__Output } from '../auth/ValidateRequest';
import type { ValidateResponse as _auth_ValidateResponse, ValidateResponse__Output as _auth_ValidateResponse__Output } from '../auth/ValidateResponse';

export interface AuthClient extends grpc.Client {
  ValidateToken(argument: _auth_ValidateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_ValidateResponse__Output>): grpc.ClientUnaryCall;
  ValidateToken(argument: _auth_ValidateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_ValidateResponse__Output>): grpc.ClientUnaryCall;
  ValidateToken(argument: _auth_ValidateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_ValidateResponse__Output>): grpc.ClientUnaryCall;
  ValidateToken(argument: _auth_ValidateRequest, callback: grpc.requestCallback<_auth_ValidateResponse__Output>): grpc.ClientUnaryCall;
  validateToken(argument: _auth_ValidateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_ValidateResponse__Output>): grpc.ClientUnaryCall;
  validateToken(argument: _auth_ValidateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_ValidateResponse__Output>): grpc.ClientUnaryCall;
  validateToken(argument: _auth_ValidateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_ValidateResponse__Output>): grpc.ClientUnaryCall;
  validateToken(argument: _auth_ValidateRequest, callback: grpc.requestCallback<_auth_ValidateResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthHandlers extends grpc.UntypedServiceImplementation {
  ValidateToken: grpc.handleUnaryCall<_auth_ValidateRequest__Output, _auth_ValidateResponse>;
  
}

export interface AuthDefinition extends grpc.ServiceDefinition {
  ValidateToken: MethodDefinition<_auth_ValidateRequest, _auth_ValidateResponse, _auth_ValidateRequest__Output, _auth_ValidateResponse__Output>
}
