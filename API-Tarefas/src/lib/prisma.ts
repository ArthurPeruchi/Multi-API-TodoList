import { PrismaClient } from "@prisma/client";

// Cria uma instância do Prisma para acessar o PostgreSQL.
export const prisma = new PrismaClient();