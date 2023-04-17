// Original file: proto/message.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { FriendMessageRequest as _message_FriendMessageRequest, FriendMessageRequest__Output as _message_FriendMessageRequest__Output } from '../message/FriendMessageRequest';
import type { FriendMessageResponse as _message_FriendMessageResponse, FriendMessageResponse__Output as _message_FriendMessageResponse__Output } from '../message/FriendMessageResponse';
import type { GroupMessageRequest as _message_GroupMessageRequest, GroupMessageRequest__Output as _message_GroupMessageRequest__Output } from '../message/GroupMessageRequest';
import type { GroupMessageResponse as _message_GroupMessageResponse, GroupMessageResponse__Output as _message_GroupMessageResponse__Output } from '../message/GroupMessageResponse';

export interface MessageClient extends grpc.Client {
  saveFriendMessage(argument: _message_FriendMessageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_message_FriendMessageResponse__Output>): grpc.ClientUnaryCall;
  saveFriendMessage(argument: _message_FriendMessageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_message_FriendMessageResponse__Output>): grpc.ClientUnaryCall;
  saveFriendMessage(argument: _message_FriendMessageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_message_FriendMessageResponse__Output>): grpc.ClientUnaryCall;
  saveFriendMessage(argument: _message_FriendMessageRequest, callback: grpc.requestCallback<_message_FriendMessageResponse__Output>): grpc.ClientUnaryCall;
  saveFriendMessage(argument: _message_FriendMessageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_message_FriendMessageResponse__Output>): grpc.ClientUnaryCall;
  saveFriendMessage(argument: _message_FriendMessageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_message_FriendMessageResponse__Output>): grpc.ClientUnaryCall;
  saveFriendMessage(argument: _message_FriendMessageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_message_FriendMessageResponse__Output>): grpc.ClientUnaryCall;
  saveFriendMessage(argument: _message_FriendMessageRequest, callback: grpc.requestCallback<_message_FriendMessageResponse__Output>): grpc.ClientUnaryCall;
  
  saveGroupMessage(argument: _message_GroupMessageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_message_GroupMessageResponse__Output>): grpc.ClientUnaryCall;
  saveGroupMessage(argument: _message_GroupMessageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_message_GroupMessageResponse__Output>): grpc.ClientUnaryCall;
  saveGroupMessage(argument: _message_GroupMessageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_message_GroupMessageResponse__Output>): grpc.ClientUnaryCall;
  saveGroupMessage(argument: _message_GroupMessageRequest, callback: grpc.requestCallback<_message_GroupMessageResponse__Output>): grpc.ClientUnaryCall;
  saveGroupMessage(argument: _message_GroupMessageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_message_GroupMessageResponse__Output>): grpc.ClientUnaryCall;
  saveGroupMessage(argument: _message_GroupMessageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_message_GroupMessageResponse__Output>): grpc.ClientUnaryCall;
  saveGroupMessage(argument: _message_GroupMessageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_message_GroupMessageResponse__Output>): grpc.ClientUnaryCall;
  saveGroupMessage(argument: _message_GroupMessageRequest, callback: grpc.requestCallback<_message_GroupMessageResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface MessageHandlers extends grpc.UntypedServiceImplementation {
  saveFriendMessage: grpc.handleUnaryCall<_message_FriendMessageRequest__Output, _message_FriendMessageResponse>;
  
  saveGroupMessage: grpc.handleUnaryCall<_message_GroupMessageRequest__Output, _message_GroupMessageResponse>;
  
}

export interface MessageDefinition extends grpc.ServiceDefinition {
  saveFriendMessage: MethodDefinition<_message_FriendMessageRequest, _message_FriendMessageResponse, _message_FriendMessageRequest__Output, _message_FriendMessageResponse__Output>
  saveGroupMessage: MethodDefinition<_message_GroupMessageRequest, _message_GroupMessageResponse, _message_GroupMessageRequest__Output, _message_GroupMessageResponse__Output>
}
