import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { PortfolioSummaryComponent } from './portfolio-summary.component';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { FormsModule } from '@angular/forms';
import { MarketSummaryComponent } from './market-summary/market-summary.component';


@NgModule({
  declarations: [PortfolioSummaryComponent, MarketSummaryComponent],
  imports: [
    FormsModule,
    CommonModule,
    SummaryRoutingModule,
    MaterialModule,
    CustomDirectiveModule
  ],
  exports: [MarketSummaryComponent]
})
export class SummaryModule { }
