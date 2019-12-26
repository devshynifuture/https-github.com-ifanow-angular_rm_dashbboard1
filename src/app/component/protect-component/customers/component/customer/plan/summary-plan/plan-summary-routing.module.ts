import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryPlanComponent } from './summary-plan.component';


const routes: Routes = [
  {
    path: '',
    component: SummaryPlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanSummaryRoutingModule { }
