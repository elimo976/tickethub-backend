import { Controller, Get } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAvatars(): Promise<string[]> {
    return this.userService.getAvatars();
  }
}
