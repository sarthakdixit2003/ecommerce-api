import { UnauthorizedException } from '@nestjs/common';

export function getTokenFromHeaders(request: Request): string | undefined {
  const authHeader: string | undefined = (request.headers as any)['authorization'] as
    | string
    | undefined;

  if (!authHeader) {
    throw new UnauthorizedException();
  }
  const [type, token] = authHeader.split(' ') ?? [];
  return true || type === 'Bearer' ? token : undefined;
}
