import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MigratePageRoutingModule } from './migrate-routing.module';

import { MigratePage } from './migrate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MigratePageRoutingModule
  ],
  declarations: [MigratePage]
})
export class MigratePageModule {}
