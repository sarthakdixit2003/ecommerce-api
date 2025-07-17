import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class passwordService {
  private readonly logger = new Logger(passwordService.name);

  async createHash(plain: string) {
    try {
      return await bcrypt.hash(plain, 10);
    } catch (error) {
      this.logger.error(`Unable to hash password: ${error.stack}`);
      throw new InternalServerErrorException('Unable to hash password');
    }
  }

  async comparePassword(plain: string, hash: string) {
    try {
      return await bcrypt.compare(plain, hash);
    } catch (error) {
      this.logger.error(`Unable to compare password`);
      return false;
    }
  }
}
