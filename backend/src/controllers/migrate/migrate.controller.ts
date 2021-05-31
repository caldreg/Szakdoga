import { FirebaseAdminService } from './../../services/firebase-admin/firebase-admin.service';
import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';

@Controller('migrate')
export class MigrateController {

    constructor(private adminApi: FirebaseAdminService) {}

    @Post('/collections')
    async migrateCollections(@Body() body): Promise<any> {
        const response = await this.adminApi.migrateCollections(body);
        return response;
    }

    @Post('/users')
    async migrateUsers(@Body() body): Promise<any> {
        const response = await this.adminApi.migrateUsers(body);
        return response;
    }
}
