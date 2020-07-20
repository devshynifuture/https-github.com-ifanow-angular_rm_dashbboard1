import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpertsRoutingModule } from './experts-routing.module';
import { ExpertsComponent } from './experts.component';


@NgModule({
  declarations: [ExpertsComponent],
  imports: [
    CommonModule,
    ExpertsRoutingModule
  ]
})
export class ExpertsModule { }
