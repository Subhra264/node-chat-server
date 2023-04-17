import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { GroupClient as _group_GroupClient, GroupDefinition as _group_GroupDefinition } from './group/Group';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  group: {
    Group: SubtypeConstructor<typeof grpc.Client, _group_GroupClient> & { service: _group_GroupDefinition }
    GroupExistRequest: MessageTypeDefinition
    GroupExistResponse: MessageTypeDefinition
    MembersRequest: MessageTypeDefinition
    MembersResponse: MessageTypeDefinition
  }
}

