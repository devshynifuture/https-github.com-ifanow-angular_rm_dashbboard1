import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerComponent } from './component/customer/customer.component';


const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      {
        path: 'overview',
        loadChildren: () => import('./component/customer/customer-overview/customer-overview.module').then(m => m.CustomerOverviewModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./component/customer/accounts/account.module')
          .then(m => m.AccountModule)
      },
      {
        path: 'plan',
        // loadChildren: './component/protect-component/customers/customers.module#CustomersModule'
        loadChildren: () => import('./component/customer/plan/plan.module')
          .then(m => m.PlanModule)
      },
      {
        path: 'activity',
        loadChildren: () => import('./component/customer/customer-activity/customer-activity.module')
          .then(m => m.CustomerActivityModule)
      },
      {
        path: 'transact',
        loadChildren: () => import('./component/customer/customer-transact/customer-transact.module')
          .then(m => m.CustomerTransactModule)
      },
      {
        path: '',
        redirectTo: '/overview',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule {
}
