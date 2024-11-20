import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const roles = ["owner", "admin", "user"];
  const users = [
    {
      email: "alghost900020@gmail.com",
      username: "khemu",
      password: "password",
    },
    {
      email: "stxerror2004@gmail.com",
      username: "Moamen",
      password: "password",
    },
  ];

  // Dynamically create roles if they don't exist
  await Promise.all(
    roles.map((role) =>
      prisma.role.upsert({
        where: { name: role },
        update: {},
        create: { name: role },
      })
    )
  );

  // Hash passwords for all users
  const hashedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      passwordHash: await bcrypt.hash(user.password, 10),
    }))
  );

  // Find the "owner" role
  const ownerRole = await prisma.role.findUnique({ where: { name: "owner" } });

  if (!ownerRole) {
    throw new Error(
      "Owner role not found. Ensure roles are correctly created."
    );
  }

  // Check if users exist and create or skip accordingly
  for (const user of hashedUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      // Create new user if they don't exist
      const createdUser = await prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          passwordHash: user.passwordHash,
        },
      });

      // Link user to the "owner" role
      await prisma.userRole.create({
        data: {
          userId: createdUser.id,
          roleId: ownerRole.id,
        },
      });

      // Create a group for the new user
      await prisma.group.create({
        data: {
          name: `${createdUser.username}'s group`,
          ownerId: createdUser.id,
        },
      });
    } else {
      console.log(
        `User with email ${user.email} already exists, skipping creation.`
      );
    }
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
