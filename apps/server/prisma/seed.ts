import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "admin@example.com",
        username: "admin",
        password: hashed,
        role: "ADMIN"
      },
      {
        email: "user@example.com",
        username: "user",
        password: hashed,
        role: "USER"
      }
    ]
  });

  console.log("Seeded users");
}

main().finally(() => prisma.$disconnect());
