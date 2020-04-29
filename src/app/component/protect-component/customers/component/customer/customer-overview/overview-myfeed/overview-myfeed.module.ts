import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewMyfeedRoutingModule } from './overview-myfeed-routing.module';
import { OverviewMyfeedComponent } from './overview-myfeed.component';
import { MaterialModule } from 'src/app/material/material';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';


@NgModule({
  declarations: [OverviewMyfeedComponent],
  imports: [
    CommonModule,
    OverviewMyfeedRoutingModule,
    MaterialModule,
    NgCircleProgressModule,
    HighchartsChartModule,
    ChartModule,
  ]
})
export class OverviewMyfeedModule { }
