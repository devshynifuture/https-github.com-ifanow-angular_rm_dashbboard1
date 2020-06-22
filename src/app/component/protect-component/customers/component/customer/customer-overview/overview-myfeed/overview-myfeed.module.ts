import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OverviewMyfeedRoutingModule} from './overview-myfeed-routing.module';
import {OverviewMyfeedComponent} from './overview-myfeed.component';
import {MaterialModule} from 'src/app/material/material';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {HighchartsChartModule} from 'highcharts-angular';
import {ChartModule} from 'angular-highcharts';
import {SummaryModule} from '../../accounts/portfolio-summary/summary.module';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {CustomDirectiveModule} from 'src/app/common/directives/common-directive.module';


@NgModule({
  declarations: [OverviewMyfeedComponent],
  imports: [
    CommonModule,
    OverviewMyfeedRoutingModule,
    CustomDirectiveModule,
    MaterialModule,
    NgCircleProgressModule,
    HighchartsChartModule,
    ChartModule,
    SlickCarouselModule,
    SummaryModule,
  ]
})
export class OverviewMyfeedModule { }
