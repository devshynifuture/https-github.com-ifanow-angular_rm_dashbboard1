import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkReportSendingComponent } from './bulk-report-sending.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: BulkReportSendingComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkReportSendingRoutingModule { 
  openSendNow(){
    
  }
}
