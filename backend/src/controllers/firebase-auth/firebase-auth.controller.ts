import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase/firebase.service';

@Controller('firebase')
export class FirebaseAuthController {

  constructor(private firebase: FirebaseService) {}

  @Get('/users')
  async getUsers(): Promise<any> {
    const responseText = await this.firebase.getUsers();
    return responseText;
  }

  @Delete('/user/:id')
  async deleteUser(@Param() params): Promise<any> {
    const response = await this.firebase.deleteUser(params.id);
    return JSON.stringify({ status: response });
  }
}
