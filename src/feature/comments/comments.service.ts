// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  // 获取某个文章的所有评论，包括回复
  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        replies: true, // 同时返回评论的回复
        author: true, // 返回评论作者
      },
    });
  }

  // 创建评论
  async createComment(postId: number, userId: string, content: string): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
    });
  }

  // 创建回复
  async createReply(commentId: number, userId: string, content: string): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        content,
        postId: commentId, // 回复属于某篇文章
        authorId: userId,
        parentId: commentId, // 回复的父评论
      },
    });
  }
}
