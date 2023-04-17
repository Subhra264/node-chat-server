// Original file: proto/message.proto


export interface FriendMessageRequest {
  'senderId'?: (string);
  'recipentId'?: (string);
  'message'?: (string);
  'encKey'?: (string);
  '_encKey'?: "encKey";
}

export interface FriendMessageRequest__Output {
  'senderId'?: (string);
  'recipentId'?: (string);
  'message'?: (string);
  'encKey'?: (string);
}
