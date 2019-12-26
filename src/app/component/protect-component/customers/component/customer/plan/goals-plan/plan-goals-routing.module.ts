import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoalsPlanComponent } from './goals-plan.component';


const routes: Routes = [
  {
    path: '',
    component: GoalsPlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanGoalsRoutingModule { }
