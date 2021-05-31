import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandelComponent } from '../../components/handel/handel.component';

@NgModule({
  declarations: [
    HandelComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HandelComponent
  ]
})
export class SharedModule { }
