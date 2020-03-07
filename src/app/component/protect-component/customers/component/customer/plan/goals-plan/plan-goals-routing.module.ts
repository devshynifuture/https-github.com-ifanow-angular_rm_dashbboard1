import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoalsPlanComponent } from './goals-plan.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


const routes: Routes = [
  {
    path: '',
    component: GoalsPlanComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DragDropModule,
  ],
  exports: [RouterModule]
})
export class PlanGoalsRoutingModule { }
