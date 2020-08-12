import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { PortfolioSummaryComponent } from './portfolio-summary.component';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketSummaryComponent } from './market-summary/market-summary.component';
import { ChartModule } from 'angular-highcharts';


@NgModule({
  declarations: [PortfolioSummaryComponent, MarketSummaryComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SummaryRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
    ChartModule
  ],
  exports: [MarketSummaryComponent]
})
export class SummaryModule { }
