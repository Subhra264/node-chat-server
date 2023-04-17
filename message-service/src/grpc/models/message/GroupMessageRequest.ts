// Original file: proto/message.proto


export interface GroupMessageRequest {
  'groupId'?: (string);
  'channelId'?: (string);
  'userId'?: (string);
  'message'?: (string);
  'encKey'?: (string);
  '_encKey'?: "encKey";
}

export interface GroupMessageRequest__Output {
  'groupId'?: (string);
  'channelId'?: (string);
  'userId'?: (string);
  'message'?: (string);
  'encKey'?: (string);
}
