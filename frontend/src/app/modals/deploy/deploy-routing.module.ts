import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeployPage } from './deploy.page';

const routes: Routes = [
  {
    path: '',
    component: DeployPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeployPageRoutingModule {}
