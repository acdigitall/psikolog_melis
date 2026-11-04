if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "mysql://root:root@127.0.0.1:8889/psikolog";
}

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Reset stale cached instance in dev mode if new models like slide or pageHeader are missing
if (globalThis.prismaGlobal && (!(globalThis.prismaGlobal as any).slide || !(globalThis.prismaGlobal as any).pageHeader)) {
  globalThis.prismaGlobal = undefined;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
