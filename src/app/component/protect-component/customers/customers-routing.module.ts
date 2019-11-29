import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CustomerComponent} from './component/customer/customer.component';


const routes: Routes = [{
  path: '',
  component: CustomerComponent,
  /*children: [
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
  ]*/
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule {
}
