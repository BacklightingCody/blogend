import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';

const prisma = new PrismaClient();

async function main() {
  try {
    // 读取 JSON 文件
    const data = JSON.parse(await fs.readFile('data.json', 'utf-8'));

    // 插入用户数据
    if (data.users) {
      for (const user of data.users) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {},
          create: user,
        });
      }
      console.log('Users inserted successfully.');
    }
    // 插入文章数据
    for (const post of data.posts) {
      await prisma.post.upsert({
        where: { id: post.id },
        update: {},
        create: post,
      });
    }
    console.log('Posts inserted successfully.');

    // 插入评论数据
    for (const comment of data.comments) {
      await prisma.comment.create({
        data: comment,
      });
    }
    console.log('Comments inserted successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
