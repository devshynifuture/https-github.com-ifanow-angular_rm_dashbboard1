import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsSummaryRoutingModule } from './accounts-summary-routing.module';
import { AccountsSummaryComponent } from './accounts-summary.component';
import { SummaryComponent } from '../summary/summary.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [AccountsSummaryComponent, SummaryComponent],
  imports: [
    CommonModule,
    AccountsSummaryRoutingModule,
    MaterialModule
  ]
})
export class AccountsSummaryModule { }
