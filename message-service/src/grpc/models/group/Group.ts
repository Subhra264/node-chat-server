// Original file: proto/group.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GroupExistRequest as _group_GroupExistRequest, GroupExistRequest__Output as _group_GroupExistRequest__Output } from '../group/GroupExistRequest';
import type { GroupExistResponse as _group_GroupExistResponse, GroupExistResponse__Output as _group_GroupExistResponse__Output } from '../group/GroupExistResponse';
import type { MembersRequest as _group_MembersRequest, MembersRequest__Output as _group_MembersRequest__Output } from '../group/MembersRequest';
import type { MembersResponse as _group_MembersResponse, MembersResponse__Output as _group_MembersResponse__Output } from '../group/MembersResponse';

export interface GroupClient extends grpc.Client {
  doesGroupExist(argument: _group_GroupExistRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_group_GroupExistResponse__Output>): grpc.ClientUnaryCall;
  doesGroupExist(argument: _group_GroupExistRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_group_GroupExistResponse__Output>): grpc.ClientUnaryCall;
  doesGroupExist(argument: _group_GroupExistRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_group_GroupExistResponse__Output>): grpc.ClientUnaryCall;
  doesGroupExist(argument: _group_GroupExistRequest, callback: grpc.requestCallback<_group_GroupExistResponse__Output>): grpc.ClientUnaryCall;
  doesGroupExist(argument: _group_GroupExistRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_group_GroupExistResponse__Output>): grpc.ClientUnaryCall;
  doesGroupExist(argument: _group_GroupExistRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_group_GroupExistResponse__Output>): grpc.ClientUnaryCall;
  doesGroupExist(argument: _group_GroupExistRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_group_GroupExistResponse__Output>): grpc.ClientUnaryCall;
  doesGroupExist(argument: _group_GroupExistRequest, callback: grpc.requestCallback<_group_GroupExistResponse__Output>): grpc.ClientUnaryCall;
  
  getMembers(argument: _group_MembersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_group_MembersResponse__Output>): grpc.ClientUnaryCall;
  getMembers(argument: _group_MembersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_group_MembersResponse__Output>): grpc.ClientUnaryCall;
  getMembers(argument: _group_MembersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_group_MembersResponse__Output>): grpc.ClientUnaryCall;
  getMembers(argument: _group_MembersRequest, callback: grpc.requestCallback<_group_MembersResponse__Output>): grpc.ClientUnaryCall;
  getMembers(argument: _group_MembersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_group_MembersResponse__Output>): grpc.ClientUnaryCall;
  getMembers(argument: _group_MembersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_group_MembersResponse__Output>): grpc.ClientUnaryCall;
  getMembers(argument: _group_MembersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_group_MembersResponse__Output>): grpc.ClientUnaryCall;
  getMembers(argument: _group_MembersRequest, callback: grpc.requestCallback<_group_MembersResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface GroupHandlers extends grpc.UntypedServiceImplementation {
  doesGroupExist: grpc.handleUnaryCall<_group_GroupExistRequest__Output, _group_GroupExistResponse>;
  
  getMembers: grpc.handleUnaryCall<_group_MembersRequest__Output, _group_MembersResponse>;
  
}

export interface GroupDefinition extends grpc.ServiceDefinition {
  doesGroupExist: MethodDefinition<_group_GroupExistRequest, _group_GroupExistResponse, _group_GroupExistRequest__Output, _group_GroupExistResponse__Output>
  getMembers: MethodDefinition<_group_MembersRequest, _group_MembersResponse, _group_MembersRequest__Output, _group_MembersResponse__Output>
}
