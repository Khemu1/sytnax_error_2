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

  // Find roles
  const ownerRole = await prisma.role.findUnique({
    where: { name: "owner" },
  });
  const adminRole = await prisma.role.findUnique({
    where: { name: "admin" },
  });

  if (!ownerRole || !adminRole) {
    throw new Error(
      "Required roles not found. Ensure roles are correctly created."
    );
  }

  // Ensure specified owners exist, link to "owner" role, and create groups for them
  for (const user of hashedUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    let createdUser;
    if (!existingUser) {
      createdUser = await prisma.user.create({
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
    } else {
      console.log(
        `User with email ${user.email} already exists, skipping creation.`
      );
      createdUser = existingUser;
    }

    // Create a group for the user if they don't already have one
    const existingGroup = await prisma.group.findFirst({
      where: { ownerId: createdUser.id },
    });

    if (!existingGroup) {
      await prisma.group.create({
        data: {
          name: `${createdUser.username}'s group`,
          ownerId: createdUser.id,
        },
      });
      console.log(`Group created for ${createdUser.username}`);
    } else {
      console.log(`${createdUser.username} already has a group.`);
    }
  }

  // Check all admins and create groups for them if they don't have any
  const adminRoles = await prisma.userRole.findMany({
    where: {
      roleId: adminRole.id,
    },
    include: {
      user: true, // Include the user associated with the role
    },
  });
  for (const adminRole of adminRoles) {
    const admin = adminRole.user;

    const adminGroup = await prisma.group.findFirst({
      where: { ownerId: admin.id },
    });

    if (!adminGroup) {
      await prisma.group.create({
        data: {
          name: `${admin.username}'s group`,
          ownerId: admin.id,
        },
      });
      console.log(`Group created for admin ${admin.username}`);
    } else {
      console.log(`Admin ${admin.username} already has a group.`);
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
