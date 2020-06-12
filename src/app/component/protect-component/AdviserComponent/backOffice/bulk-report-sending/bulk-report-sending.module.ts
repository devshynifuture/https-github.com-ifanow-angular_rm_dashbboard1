import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkReportSendingRoutingModule } from './bulk-report-sending-routing.module';
import { BulkReportSendingComponent } from './bulk-report-sending.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';
import { SendNowReportsComponent } from './send-now-reports/send-now-reports.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';



@NgModule({
  declarations: [BulkReportSendingComponent],
  imports: [
    CommonModule,
    BulkReportSendingRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    CustomDirectiveModule
  ]
})
export class BulkReportSendingModule { }
