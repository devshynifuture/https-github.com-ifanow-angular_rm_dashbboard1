import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewMyfeedRoutingModule } from './overview-myfeed-routing.module';
import { OverviewMyfeedComponent } from './overview-myfeed.component';
import { MaterialModule } from 'src/app/material/material';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';
import { AllFeedsComponent } from './all-feeds/all-feeds.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PlanComponent } from './plan/plan.component';
import { ActivityComponent } from './activity/activity.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ProfileComponent } from './profile/profile.component';
import { EducationComponent } from './education/education.component';
import { VideosComponent } from './videos/videos.component';


@NgModule({
  declarations: [OverviewMyfeedComponent, AllFeedsComponent, PortfolioComponent, PlanComponent, ActivityComponent, TransactionsComponent, ProfileComponent, EducationComponent, VideosComponent],
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
