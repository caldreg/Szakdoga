import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeployPageRoutingModule } from './deploy-routing.module';

import { DeployPage } from './deploy.page';
import { SharedModule } from '../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeployPageRoutingModule,
    SharedModule
  ],
  declarations: [DeployPage]
})
export class DeployPageModule {}
