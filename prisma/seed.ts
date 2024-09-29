import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create roles if they don't exist
  await prisma.role.upsert({
    where: { name: "owner" },
    update: {},
    create: { name: "owner" },
  });
  await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });
  await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });

  // Emails and password hash
  const ownerEmail = "alghost900020@gmail.com";
  const ownerEmail2 = "stxerror2004@gmail.com"; // New owner email
  const hashedPassword = await bcrypt.hash("password", 10);

  // Find roles
  const ownerRole = await prisma.role.findUnique({ where: { name: "owner" } });

  // Create or update users
  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      username: "khemu",
      passwordHash: hashedPassword,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: ownerEmail2 },
    update: {},
    create: {
      email: ownerEmail2,
      username: "Moamen", // New owner username
      passwordHash: hashedPassword,
    },
  });

  // Link users to roles (userRole)
  if (ownerRole && owner) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: owner.id,
          roleId: ownerRole.id,
        },
      },
      update: {},
      create: {
        userId: owner.id,
        roleId: ownerRole.id,
      },
    });
  }

  if (ownerRole && owner2) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: owner2.id,
          roleId: ownerRole.id,
        },
      },
      update: {},
      create: {
        userId: owner2.id,
        roleId: ownerRole.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
