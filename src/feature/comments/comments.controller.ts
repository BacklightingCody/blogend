import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('articles') // 修改为 'articles' 开头
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 获取某个文章的所有评论
  @Get(':articleId/comments')
  async getComments(
    @Param('articleId') articleId: string,
    @Query('sortBy') sortBy: 'hot' | 'time' = 'time', // 支持根据时间或热度排序
  ) {
    const comments = await this.commentsService.getCommentsByPost(articleId, sortBy);
    return {
      msg: '获取评论成功',
      data: {
        articleId,
        sortBy,
        totalComments: comments.length,
        comments,
      },
    };
  }

  // 提交评论
  @Post(':articleId/comments')
  async addComment(
    @Param('articleId') articleId: string,
    @Body('userId') userId: string,
    @Body('content') content: { text: string; images: string[] },
  ) {
    const newComment = await this.commentsService.createComment(articleId, userId, content);
    return {
      msg: '评论成功',
      data: { newComment },
    };
  }

  // 提交回复
  @Post('comments/:commentId/replies')
  addReply(
    @Param('commentId') commentId: number,
    @Body('userId') userId: string,
    @Body('content') content: { text: string; images: string[] },
  ) {
    return this.commentsService.createReply(+commentId, userId, content);
  }

  // 点赞评论或回复
  @Post('comments/:id/like')
  likeComment(
    @Param('id') commentId: number, // 点赞评论
    @Body('userId') userId: string,
  ) {
    return this.commentsService.likeComment(+commentId, userId); // false 表示是评论
  }

  @Post('replies/:id/like')
  likeReply(
    @Param('id') replyId: number, // 点赞回复
    @Body('userId') userId: string,
  ) {
    return this.commentsService.likeComment(+replyId, userId); // true 表示是回复
  }
}
