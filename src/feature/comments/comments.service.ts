import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  // 获取某个文章的评论，按时间或热度排序
  async getCommentsByPost(postId: string, sortBy: 'hot' | 'time') {
    const commentsForPost = await this.prisma.comment.findMany({
      where: { postId, parentId: null }, // 只获取顶层评论
      orderBy: sortBy === 'hot' ? { likes: 'desc' } : { createdAt: 'desc' },
      include: {
        replies: {
          include: {
            author: true, // 包括回复的用户信息
          },
        },
        author: true, // 包括评论的用户信息
      },
    });
    console.log('commentsForPost', commentsForPost);
    // 将查询结果映射为更简洁的结构
    return commentsForPost.map((comment) => ({
      id: comment.id,
      postId: comment.postId,
      content: comment.content,
      likes: comment.likes,
      createdAt: comment.createdAt,
      user: {
        id: comment.author.id,
        nickname: comment.author.username,
        avatar: comment.author.avatarUrl,
      },
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        likes: reply.likes,
        createdAt: reply.createdAt,
        replyTo: reply.parentId ? reply.parentId.toString() : null,
        user: {
          id: reply.author.id,
          nickname: reply.author.username,
          avatar: reply.author.avatarUrl,
        },
      })),
    }));
  }

  // 创建评论
  async createComment(postId: string, userId: string, content: { text: string; images: string[] }) {
    console.log('createComment', postId, userId, content);
    const newComment = await this.prisma.comment.create({
      data: {
        postId,
        authorId: userId,
        content,
        likes: 0, // 初始化点赞数为 0
      },
      include: {
        author: true,
      },
    });
    return {
      id: newComment.id,
      postId: newComment.postId,
      content: newComment.content,
      likes: newComment.likes,
      createdAt: newComment.createdAt,
      user: {
        id: newComment.author.id,
        nickname: newComment.author.username,
        avatar: newComment.author.avatarUrl,
      },
      replies: [], // 新创建的评论没有回复
    };
  }

  // 创建评论的回复
  async createReply(
    commentId: number,
    userId: string,
    content: { text: string; images: string[] },
  ) {
    const parentComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    const newReply = await this.prisma.comment.create({
      data: {
        postId: parentComment.postId, // 继承父评论所属的文章
        authorId: userId,
        content,
        parentId: commentId, // 关联父评论
        likes: 0, // 初始化点赞数为 0
      },
    });

    return { ...newReply, content };
  }

  // 点赞评论
  async likeComment(commentId: number, userId: string) {
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

  // 点赞回复
  async likeReply(replyId: number, userId: string) {
    const updatedReply = await this.prisma.comment.update({
      where: { id: replyId },
      data: {
        likes: {
          increment: 1, // 点赞数增加 1
        },
      },
    });
    return updatedReply;
  }
}
