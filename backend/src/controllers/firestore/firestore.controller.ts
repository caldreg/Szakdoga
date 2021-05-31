import { FirebaseAdminService } from './../../services/firebase-admin/firebase-admin.service';
import { FirebaseService } from './../../services/firebase/firebase.service';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { Param } from '@nestjs/common';

@Controller('firestore')
export class FirestoreController {

    constructor(private firebaseAPI: FirebaseService, private firebaseAdmin: FirebaseAdminService) {}

    @Get('projects')
    async getProjects(): Promise<any> {
        const response = await this.firebaseAPI.getProjects();
        return response;
    }

    @Get('projects/:project/collections')
    async getCollections(@Param() params): Promise<any> {
        const response = await this.firebaseAdmin.getProjectCollections(params.project);
        return response;
    }

    @Get('/users/:project')
    async getProjectUsers(@Param() params): Promise<any> {
        const response = await this.firebaseAdmin.getProjectUsers(params.project);
        return response;
    }

    @Get('/projects/:project/indexes')
    async uploadProjectData(@Param() params) {
        const response = await this.firebaseAdmin.getProejctIndexes(params.project)
        return response;

    }
}
