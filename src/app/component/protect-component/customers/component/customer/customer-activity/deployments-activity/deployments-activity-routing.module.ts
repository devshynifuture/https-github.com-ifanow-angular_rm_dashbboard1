import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeploymentsActivityComponent } from './deployments-activity.component';


const routes: Routes = [
  {
    path: '',
    component: DeploymentsActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeploymentsActivityRoutingModule { }
