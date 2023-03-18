import { PrismaClient } from '@prisma/client';

class PrismaORM {
  private static prisma_: undefined | PrismaClient;

  static get() {
    if (!this.prisma_) this.prisma_ = new PrismaClient();
    return this.prisma_;
  }
}

export default PrismaORM;
