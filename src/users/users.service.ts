import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByMobile(mobile: string) {
    return this.repo.findOne({ where: { mobile } });
  }

  async upsertByMobile(mobile: string) {
    let user = await this.findByMobile(mobile);
    if (!user) {
      user = this.repo.create({ mobile });
      user = await this.repo.save(user);
    }
    return user;
  }
}
