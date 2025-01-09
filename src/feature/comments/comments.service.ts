import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  // 模拟数据库中的评论数据
  private comments = [
    {
      id: 1,
      userId: '1',
      postId: 1,
      content: 'This is a comment.',
      likes: 5,
      time: new Date('2023-01-01'),
      replies: [],
    },
  ];

  // 获取某个文章的评论，按时间或热度排序
  getCommentsByPost(postId: number, sortBy: 'hot' | 'time') {
    const commentsForPost = this.comments.filter((comment) => comment.postId === postId);

    // 根据排序方式排序
    if (sortBy === 'hot') {
      return commentsForPost.sort((a, b) => b.likes - a.likes); // 热度排序：按点赞数排序
    } else {
      return commentsForPost.sort((a, b) => b.time.getTime() - a.time.getTime()); // 时间排序：按时间排序
    }
  }

  // 创建评论
  createComment(postId: number, userId: string, content: string) {
    const newComment = {
      id: this.comments.length + 1,
      userId,
      postId,
      content,
      likes: 0,
      time: new Date(),
      replies: [],
    };
    this.comments.push(newComment);
    return newComment;
  }

  // 创建回复
  createReply(commentId: number, userId: string, content: string) {
    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      const newReply = {
        id: comment.replies.length + 1,
        userId,
        content,
        likes: 0,
        time: new Date(),
      };
      comment.replies.push(newReply);
      return newReply;
    }
    return null;
  }

  // 点赞评论或回复
  like(type: 'comment' | 'reply', id: number) {
    if (type === 'comment') {
      const comment = this.comments.find((c) => c.id === id);
      if (comment) {
        comment.likes += 1; // 点赞数加1
        return comment;
      }
    } else {
      // 如果是回复，遍历所有评论并找到该回复
      for (const comment of this.comments) {
        const reply = comment.replies.find((r) => r.id === id);
        if (reply) {
          reply.likes += 1; // 点赞数加1
          return reply;
        }
      }
    }
    return null;
  }
}
