import { PrismaClient } from "@prisma/client";
import { menv } from "./menv";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = global.prisma ?? prismaClientSingleton();


export default db;

if (menv.NODE_ENV !== "production") global.prisma = db;
