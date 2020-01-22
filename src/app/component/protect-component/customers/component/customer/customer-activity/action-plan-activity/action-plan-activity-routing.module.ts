import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActionPlanActivityComponent } from './action-plan-activity.component';


const routes: Routes = [
  {
    path: '',
    component: ActionPlanActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionPlanActivityRoutingModule { }
