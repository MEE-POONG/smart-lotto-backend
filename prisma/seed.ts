import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
      user_email: 'admin@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      user_name: 'Manager User',
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
