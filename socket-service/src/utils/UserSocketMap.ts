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

  public static getSocketIdsForUsers(users: string[]) {
    let socketIds: Array<string> = [];
    users.forEach((userId) => {
      if (this.isUserPresent(userId)) socketIds.push(this.getSocketId(userId));
    });
    return socketIds;
  }

  public static putSocket(userId: string, socketId: string) {
    this.socketMap[userId] = socketId;
  }

  public static deleteUser(userId: string) {
    delete this.socketMap[userId];
  }
}

export default UserSocketMap;
