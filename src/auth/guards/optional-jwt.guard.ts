import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class OptionalJwtGuard {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);
        request['user'] = payload;
      } catch (error) {
        // Токен невалиден, но не блокируем запрос
        request['user'] = undefined;
      }
    } else {
      request['user'] = undefined;
    }
    
    return true; // Всегда разрешаем запрос
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
