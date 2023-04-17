// Original file: proto/auth.proto


export interface ValidateResponse {
  'status'?: (string);
  'message'?: (string);
  'userId'?: (string);
  'username'?: (string);
  '_message'?: "message";
  '_userId'?: "userId";
  '_username'?: "username";
}

export interface ValidateResponse__Output {
  'status'?: (string);
  'message'?: (string);
  'userId'?: (string);
  'username'?: (string);
}
