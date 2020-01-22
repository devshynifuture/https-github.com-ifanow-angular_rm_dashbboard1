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
        path: 'summary',
        loadChildren: () => import('./summary-activity/summary-activity.module').then(m => m.SummaryActivityModule)
      },
      {
        path: 'advice',
        loadChildren: () => import('./advice-activity/advice-activity.module').then(m => m.AdviceActivityModule)
      },
      {
        path: 'deployments',
        loadChildren: () => import('./deployments-activity/deployments-activity.module').then(m => m.DeploymentsActivityModule)
      },
      {
        path: 'action-plan',
        loadChildren: () => import('./action-plan-activity/action-plan-activity.module').then(m => m.ActionPlanActivityModule)
      },
      {
        path: 'task',
        loadChildren: () => import('./task-activity/task-activity.module').then(m => m.TaskActivityModule)
      },
      {
        path: 'notes',
        loadChildren: () => import('./notes-activity/notes-activity.module').then(m => m.NotesActivityModule)
      },
      {
        path: '',
        redirectTo: 'summary',
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
