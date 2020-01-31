import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportReportsRoutingModule } from './support-reports-routing.module';
import { ReportReceivablesComponent } from './report-receivables/report-receivables.component';
import { ReportUpsellingsComponent } from './report-upsellings/report-upsellings.component';
import { SupportReportsComponent } from './support-reports.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [SupportReportsComponent, ReportReceivablesComponent, ReportUpsellingsComponent],
  imports: [
    CommonModule,
    SupportReportsRoutingModule,
    MaterialModule
  ]
})
export class SupportReportsModule { }
