import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 获取某个文章的所有评论
  @Get('post/:postId')
  getComments(
    @Param('postId') postId: number,
    @Query('sortBy') sortBy: 'hot' | 'time' = 'time', // 支持根据时间或热度排序
  ) {
    return this.commentsService.getCommentsByPost(postId, sortBy);
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

  // 点赞评论或回复
  @Post(':type/:id/like')
  like(
    @Param('type') type: 'comment' | 'reply', // 判断是评论点赞还是回复点赞
    @Param('id') id: number, // 评论或回复的ID
  ) {
    return this.commentsService.like(type, id);
  }
}
