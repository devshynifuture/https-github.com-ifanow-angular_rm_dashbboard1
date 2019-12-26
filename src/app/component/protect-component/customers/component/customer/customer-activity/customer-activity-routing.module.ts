import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerActivityComponent } from './customer-activity.component';
import { AdviceActivityComponent } from './advice-activity/advice-activity.component';
import { DeploymentsActivityComponent } from './deployments-activity/deployments-activity.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerActivityComponent,
    children: [
      {
        path: 'advice',
        component: AdviceActivityComponent
      },
      {
        path: 'deployments',
        component: DeploymentsActivityComponent
      },
      {
        path: '',
        redirectTo: 'advice',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerActivityRoutingModule { }
