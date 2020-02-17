import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingPlanComponent } from '../setting-plan.component';


const routes: Routes = [
  {
    path: '',
    component: SettingPlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingPlanRoutingModule { }
