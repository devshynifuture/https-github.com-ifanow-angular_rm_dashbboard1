import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewMyfeedRoutingModule } from './overview-myfeed-routing.module';
import { OverviewMyfeedComponent } from './overview-myfeed.component';


@NgModule({
  declarations: [OverviewMyfeedComponent],
  imports: [
    CommonModule,
    OverviewMyfeedRoutingModule
  ]
})
export class OverviewMyfeedModule { }
