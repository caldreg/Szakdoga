import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RollbackPage } from './rollback.page';

const routes: Routes = [
  {
    path: '',
    component: RollbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RollbackPageRoutingModule {}
