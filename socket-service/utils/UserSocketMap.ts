class UserSocketMap {
  private static socketMap: Record<string, string> = {};

  public static isUserPresent(userId: string) {
    if (!this.socketMap[userId]) return false;
    return true;
  }

  public static getSocketId(userId: string) {
    const socketId = this.socketMap[userId];
    return socketId || '';
  }

  public static putSocket(userId: string, socketId: string) {
    this.socketMap[userId] = socketId;
  }

  public static deleteUser(userId) {
    delete this.socketMap[userId];
  }
}

export default UserSocketMap;
