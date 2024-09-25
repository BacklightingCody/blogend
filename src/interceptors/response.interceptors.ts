import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // 检查是否有自定义的 msg 和 code，否则使用默认值
        const response = {
          code: data?.code || 200,
          msg: data?.msg || 'success',
          data: data?.data || data,
        };
        return response;
      }),
    );
  }
}
