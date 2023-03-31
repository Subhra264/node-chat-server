class UserSocketMap {
  // Should use externally deployed key-value store to get the
  // correct socketIds for distributed connections across nodes.
  // For now, it can give socketIds of those connected to this node only
  private static socketMap: Record<string, string> = {};

  public static isUserPresent(userId: string) {
    if (!this.socketMap[userId]) return false;
    return true;
  }

  public static getSocketId(userId: string) {
    const socketId = this.socketMap[userId];
    return socketId || '';
  }

  public static getSocketIdsForUsers(users: string[], exceptUser: string = '') {
    let socketIds: Array<string> = [];
    users.forEach((userId) => {
      if (this.isUserPresent(userId) && userId !== exceptUser)
        socketIds.push(this.getSocketId(userId));
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
