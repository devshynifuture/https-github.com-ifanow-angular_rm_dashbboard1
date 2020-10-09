import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomDirectiveModule } from '../../../../common/directives/common-directive.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardGuideDialogComponent } from './dashboard-guide-dialog/dashboard-guide-dialog.component';
import { DashboardService } from './dashboard.service';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ChartModule } from 'angular-highcharts';
import { ReferAndEarnPopupsComponent } from 'src/app/component/no-protected/login/refer-and-earn-popups/refer-and-earn-popups.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ReferAndEarnPopupsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
    DashboardRoutingModule,
    CustomCommonModule,
    SlickCarouselModule,
    ChartModule
  ],
  exports: [],
  providers: [DashboardService],
  entryComponents: [ReferAndEarnPopupsComponent]
})
export class DashboardModule {
  constructor() { }
}