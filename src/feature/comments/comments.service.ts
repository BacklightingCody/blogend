import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service'; // 假设你有 PrismaService 用于与数据库交互

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  // 获取某个文章的评论，按时间或热度排序
  async getCommentsByPost(postId: number, sortBy: 'hot' | 'time') {
    const commentsForPost = await this.prisma.comment.findMany({
      where: { postId },
      orderBy: sortBy === 'hot' ? { likes: 'desc' } : { createdAt: 'desc' }, // 热度排序或时间排序
      include: {
        replies: true, // 包括回复
      },
    });

    return commentsForPost;
  }

  // 创建评论
  async createComment(postId: number, userId: string, content: string) {
    const newComment = await this.prisma.comment.create({
      data: {
        postId,
        authorId: userId,
        content,
        likes: 0, // 默认点赞数为 0
      },
    });
    return newComment;
  }

  // 创建评论的回复
  async createReply(commentId: number, userId: string, content: string) {
    const newReply = await this.prisma.comment.create({
      data: {
        postId: (await this.prisma.comment.findUnique({ where: { id: commentId } })).postId,
        authorId: userId,
        content,
        parentId: commentId, // 关联父评论
        likes: 0, // 默认点赞数为 0
      },
    });
    return newReply;
  }

  // 点赞评论
  async likeComment(commentId: number) {
    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: {
          increment: 1, // 点赞数增加 1
        },
      },
    });
    return updatedComment;
  }
}
