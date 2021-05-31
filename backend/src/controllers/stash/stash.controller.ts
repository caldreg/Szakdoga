import { Controller, Get, Param, Post } from '@nestjs/common';
import { StashService } from './../../services/stash/stash.service';


@Controller('stash')
export class StashController {

    constructor(private stashApi: StashService) {}

    @Get('/tags/:key/:project')
    async getTags(@Param() params): Promise<any> {
        const response = await this.stashApi.getTags(params.key, params.project);
        return response;
    }

    @Get('/branches/:key/:project')
    async getBranches(@Param() params): Promise<any> {
        const response = await this.stashApi.getBranhces(params.key, params.project)
        return response;
    }
}
