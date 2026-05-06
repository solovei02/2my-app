import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', saltRounds);
  const user = await prisma.user.create({
    data: {
      email: 'student@example.com',
      displayName: 'Oleksandra',
      passwordHash,
    },
  });

  await prisma.post.createMany({
    data: [
      {
        title: 'First post',
        content: 'Hello!',
        authorId: user.id,
      },
      {
        title: 'Second post',
        content: 'How are you?',
        authorId: user.id,
      },
      {
        title: 'Third post',
        content: 'What are you doing?',
        authorId: user.id,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
