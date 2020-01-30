import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerActivityComponent } from './customer-activity.component';
import { DeploymentsActivityComponent } from './deployments-activity/deployments-activity.component';
import { AdviceAllPortfolioComponent } from './advice-activity/advice-all-portfolio/advice-all-portfolio.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerActivityComponent,
    children: [
      {
        path: 'all-portfolio',
          component: AdviceAllPortfolioComponent
      },
      {
        path: 'assets',
        loadChildren: () => import('./advice-activity/advice-activity.module').then(m => m.AdviceActivityModule)
      },
      {
        path: 'mutualFunds',
        loadChildren: () => import('./deployments-activity/deployments-activity.module').then(m => m.DeploymentsActivityModule)
      },
      {
        path: 'action-plan',
        loadChildren: () => import('./action-plan-activity/action-plan-activity.module').then(m => m.ActionPlanActivityModule)
      },
      {
        path: 'stock',
        loadChildren: () => import('./task-activity/task-activity.module').then(m => m.TaskActivityModule)
      },
      {
        path: 'fixed-income',
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
export class AdviceRoutingModule { }
