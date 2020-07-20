import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { AdvisorAndOrganizationInfoService } from './resolvers/advisor-and-organization-info.service';


const routes: Routes = [
  {
    path: 'detail',
    component: CustomerComponent,
    resolve: { advisorInfo: AdvisorAndOrganizationInfoService },
    children: [
      {
        path: 'overview',
        data: { animation: 'Tab1', preload: true },
        loadChildren: () => import('./customer/customer-overview/customer-overview.module').then(m => m.CustomerOverviewModule)
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
export class CustomersRoutingModule {
}
