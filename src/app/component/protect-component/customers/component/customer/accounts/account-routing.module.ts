import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
// import {CustomerComponent} from './component/customer/customer.component';


const routes: Routes = [{
  path: '',
  component: AccountsComponent,
  children: [

    {
      path: 'summary',
      loadChildren: () => import('./summary/summary.module').then(m => m.SummaryModule),
      // data: { animation: 'Tab1', preload: true }

      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'assets',
      loadChildren: () => import('./assets/assets.module').then(m => m.AssetsModule),
      // data: { animation: 'Tab2' }

      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'liabilities',
      loadChildren: () => import('./liabilities/liabilities.module').then(m => m.LiabilitiesModule),
      // data: { animation: 'Tab1', preload: true }

    },
    {
      path: 'insurance',
      loadChildren: () => import('./insurance/insurance.module').then(m => m.InsuranceModule),
      // data: { animation: 'Tab1', preload: true }

      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'documents',
      loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule),
      // data: { animation: 'Tab1', preload: true }

      // outlet: 'accountRouterOutlet'
    },
    {
      path: '',
      redirectTo: 'summary',
      pathMatch: 'full'
    },
  ],
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
