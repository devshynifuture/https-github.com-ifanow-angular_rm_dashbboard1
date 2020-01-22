import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryActivityRoutingModule } from './summary-activity-routing.module';
import { SummaryActivityComponent } from './summary-activity.component';


@NgModule({
  declarations: [SummaryActivityComponent],
  imports: [
    CommonModule,
    SummaryActivityRoutingModule
  ]
})
export class SummaryActivityModule { }
