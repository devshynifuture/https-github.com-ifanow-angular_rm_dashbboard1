import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupportReportsComponent } from './support-reports.component';
import { ReportReceivablesComponent } from './report-receivables/report-receivables.component';
import { ReportUpsellingsComponent } from './report-upsellings/report-upsellings.component';


const routes: Routes = [
  {
    path: '',
    component: SupportReportsComponent,
    children: [
      {
        path: 'receivables',
        component: ReportReceivablesComponent
      },
      {
        path: 'upsellings',
        component: ReportUpsellingsComponent
      },
      {
        path: '',
        redirectTo: 'receivables',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportReportsRoutingModule { }
