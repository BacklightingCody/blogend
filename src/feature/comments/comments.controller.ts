// src/comments/comments.controller.ts
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 获取某个文章的所有评论
  @Get('post/:postId')
  getComments(@Param('postId') postId: number) {
    return this.commentsService.getCommentsByPost(postId);
  }

  // 创建评论
  @Post('post/:postId')
  createComment(
    @Param('postId') postId: number,
    @Body('userId') userId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.createComment(postId, userId, content);
  }

  // 创建评论的回复
  @Post('reply/:commentId')
  createReply(
    @Param('commentId') commentId: number,
    @Body('userId') userId: string,
    @Body('content') content: string,
  ) {
    return this.commentsService.createReply(commentId, userId, content);
  }
}
