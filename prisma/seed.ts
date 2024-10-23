import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

/**
 * This function is for seeding the initial data in the database.
 * It includes data for Enterprise, User, and ItemType.
 * The data is hardcoded in this function.
 * The function is called in the main function and it will be executed
 * when the application is started.
 */
async function main() {
  // Hash the password before saving to the database
  async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  const password = '123456';
  const hashedPassword = await hashPassword(password);

  // Seed data for Enterprise
  const enterprise1 = await prisma.enterprise.create({
    data: {
      enterprise_name: 'Smart Lotto Thailand',
    },
  });

  const enterprise2 = await prisma.enterprise.create({
    data: {
      enterprise_name: 'Smart Lotto International',
    },
  });

  // Seed data for User
  const user1 = await prisma.user.create({
    data: {
      user_name: 'Admin User',
      password: hashedPassword,
      user_email: 'admin@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      user_name: 'Manager User',
      password: hashedPassword,
      user_email: 'manager@example.com',
    },
  });

  // Seed data for ItemType
  const itemTypes = [
    {
      type_name: '2 ตัวบน',
      enterprise_id: enterprise1.enterprise_id,
      last_modified_by: user1.user_id,
    },
    {
      type_name: '2 ตัวล่าง',
      enterprise_id: enterprise1.enterprise_id,
      last_modified_by: user1.user_id,
    },
    {
      type_name: '3 ตัวบน',
      enterprise_id: enterprise1.enterprise_id,
      last_modified_by: user1.user_id,
    },
    {
      type_name: '3 ตัวโต๊ด',
      enterprise_id: enterprise2.enterprise_id,
      last_modified_by: user2.user_id,
    },
    {
      type_name: 'วิ่งบน',
      enterprise_id: enterprise2.enterprise_id,
      last_modified_by: user2.user_id,
    },
    {
      type_name: 'วิ่งล่าง',
      enterprise_id: enterprise2.enterprise_id,
      last_modified_by: user2.user_id,
    },
  ];

  for (const itemType of itemTypes) {
    await prisma.itemType.create({
      data: itemType,
    });
  }

  console.log('Enterprise, User, and ItemType data have been seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
