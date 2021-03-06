import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomerComponent} from './component/customer/customer.component';
import {AdvisorAndOrganizationInfoService} from './resolvers/advisor-and-organization-info.service';
import { MobileMyfeedComponent } from './component/customer/mobile/myfeed/mobile-myfeed/mobile-myfeed.component';


const routes: Routes = [
  {

    path: 'mobile',
    component: MobileMyfeedComponent,
    resolve: {advisorInfo: AdvisorAndOrganizationInfoService},
    children: [
      {
        path: 'overview',
        data: {animation: 'Tab1', preload: true},
        loadChildren: () => import('./component/customer/customer-overview/customer-overview.module').then(m => m.CustomerOverviewModule)
      },
      {
        path: 'account',

        loadChildren: () => import('./component/customer/accounts/account.module')
          .then(m => m.AccountModule),
        data: { preload: true }

      },
      {
        path: 'plan',
        // loadChildren: './component/protect-component/customers/customers.module#CustomersModule'
        loadChildren: () => import('./component/customer/plan/plan.module')
          .then(m => m.PlanModule),
        data: { preload: true }

      },
      {
        path: 'activity',
        loadChildren: () => import('./component/customer/customer-activity/customer-activity.module')
          .then(m => m.CustomerActivityModule),
        data: { preload: true }

      },
      {
        path: 'transact',
        loadChildren: () => import('./component/customer/customer-transact/customer-transact.module')
          .then(m => m.CustomerTransactModule),
        data: { preload: true }

      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule {
}
