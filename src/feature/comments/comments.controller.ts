import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ConfigService } from '@nestjs/config';

@Controller('articles')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly configService: ConfigService,
  ) {}
  isProduction = process.env.NODE_ENV === 'production';
  // 获取某个文章的所有评论
  @Get(':articleId/comments')
  async getComments(
    @Param('articleId') articleId: string,
    @Query('sortBy') sortBy: 'hot' | 'time' = 'time',
  ) {
    try {
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
    } catch (error) {
      return { msg: '获取评论失败', error: error.message };
    }
  }

  // 提交评论
  @Post(':articleId/comments')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = process.env.UPLOADS_PATH || '/var/www/images';
          console.log('uploadPath', uploadPath);
          if (uploadPath) {
            cb(null, uploadPath);
          } else {
            cb(new Error('UPLOADS_PATH环境变量未定义'), null);
          }
        },
        filename: (req, file, cb) => {
          const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'); // 替换掉特殊字符
          console.log(`Saving file: ${safeFilename}`); // 打印文件名
          cb(null, `${Date.now()}-${safeFilename}`);
        },
      }),
    }),
  )
  async addComment(
    @Param('articleId') articleId: string,
    @Body('userId') userId: string,
    @Body('text') text: string,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    try {
      const backendImageUrl = process.env.BACKEND_IMAGE_URL?.replace(/\/$/, '');
      console.log('images:', images);
      const imageUrls = images.map((file) => `${backendImageUrl}/${file.filename}`);
      console.log('imageUrls', imageUrls);

      const newComment = await this.commentsService.createComment(articleId, userId, {
        text,
        images: imageUrls,
      });
      return {
        msg: '评论成功',
        data: { newComment },
      };
    } catch (error) {
      return { msg: '评论失败', error: error.message };
    }
  }

  // 提交回复
  @Post('comments/:commentId/replies')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = process.env.UPLOADS_PATH || '/var/www/images';
          console.log('uploadPath', uploadPath);
          if (uploadPath) {
            cb(null, uploadPath);
          } else {
            cb(new Error('UPLOADS_PATH环境变量未定义'), null);
          }
        },
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async addReply(
    @Param('commentId') commentId: number,
    @Body('userId') userId: string,
    @Body('text') text: string,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    try {
      const backendImageUrl = process.env.BACKEND_IMAGE_URL?.replace(/\/$/, '');
      const imageUrls = images.map((file) => `${backendImageUrl}/${file.filename}`);
      console.log('imageUrls', imageUrls);
      const newReply = await this.commentsService.createReply(commentId, userId, {
        text,
        images: imageUrls,
      });
      return {
        msg: '回复成功',
        data: { newReply },
      };
    } catch (error) {
      return { msg: '回复失败', error: error.message };
    }
  }

  // 点赞评论或回复
  @Post('comments/:id/like')
  async likeComment(@Param('id') commentId: number, @Body('userId') userId: string) {
    try {
      await this.commentsService.likeComment(commentId, userId); // false 表示是评论
      return { msg: '点赞成功' };
    } catch (error) {
      return { msg: '点赞失败', error: error.message };
    }
  }

  @Post('replies/:id/like')
  async likeReply(@Param('id') replyId: number, @Body('userId') userId: string) {
    try {
      await this.commentsService.likeComment(replyId, userId);
      return { msg: '点赞成功' };
    } catch (error) {
      return { msg: '点赞失败', error: error.message };
    }
  }
}
