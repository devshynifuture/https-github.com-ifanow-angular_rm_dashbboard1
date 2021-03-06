import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../../material/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomDirectiveModule} from '../../../../common/directives/common-directive.module';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardService} from './dashboard.service';
import {CustomCommonModule} from 'src/app/common/custom.common.module';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {ChartModule} from 'angular-highcharts';

@NgModule({
  declarations: [
    DashboardComponent,
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
  entryComponents: []
})
export class DashboardModule {
  constructor() { }
}
