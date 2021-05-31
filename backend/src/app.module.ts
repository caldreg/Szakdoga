import { Module, HttpService } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseAuthController } from './controllers/firebase-auth/firebase-auth.controller';
import { FirebaseService } from './services/firebase/firebase.service';
import { FirestoreController } from './controllers/firestore/firestore.controller';
import { FirebaseAdminService } from './services/firebase-admin/firebase-admin.service';
import { MigrateController } from './controllers/migrate/migrate.controller';
import { JenkinsService } from './services/jenkins/jenkins.service';
import { JenkinsController } from './controllers/jenkins/jenkins.controller';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { BasicInterceptor } from './interceptors/basic.interceptor';
import { JenkinsConstantsService } from './services/jenkins-constants/jenkins-constants.service';
import { StashService } from './services/stash/stash.service';
import { StashController } from './controllers/stash/stash.controller';
import { HttpModule } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [
    AppController,
    FirebaseAuthController,
    FirestoreController,
    MigrateController,
    JenkinsController,
    StashController
  ],
  providers: [
    AppService,
    FirebaseService,
    FirebaseAdminService,
    JenkinsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: BasicInterceptor,
    },
    JenkinsConstantsService,
    StashService,
  ],
})
export class AppModule {}
