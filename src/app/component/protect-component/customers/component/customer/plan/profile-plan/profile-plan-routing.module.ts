import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePlanComponent } from './profile-plan.component';


const routes: Routes = [
  {
    path: '',
    component: ProfilePlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilePlanRoutingModule { }
