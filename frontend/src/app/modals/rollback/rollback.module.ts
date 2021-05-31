import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RollbackPageRoutingModule } from './rollback-routing.module';

import { SharedModule } from '../../modules/shared/shared.module';
import { RollbackPage } from './rollback.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RollbackPageRoutingModule,
    SharedModule
  ],
  declarations: [RollbackPage]
})
export class RollbackPageModule {}
