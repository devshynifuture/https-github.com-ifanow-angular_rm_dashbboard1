import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountsComponent} from './accounts.component';
// import {CustomerComponent} from './component/customer/customer.component';


const routes: Routes = [{
  path: '',
  component: AccountsComponent,
  children: [

    {
      path: 'summary',
      loadChildren: () => import('./accounts-summary/accounts-summary.module').then(m => m.AccountsSummaryModule),
      data: {animation: 'Tab1', preload: true}

      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'assets',
      loadChildren: () => import('./account-assets/account-assets.module').then(m => m.AccountAssetsModule),
      data: {animation: 'Tab2'}

      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'liabilities',
      loadChildren: () => import('./accounts-liabilities/accounts-liabilities.module').then(m => m.AccountsLiabilitiesModule),
      data: {animation: 'Tab1', preload: true}

    },
    {
      path: 'insurance',
      loadChildren: () => import('./accounts-insurance/accounts-insurance.module').then(m => m.AccountsInsuranceModule),
      data: {animation: 'Tab1', preload: true}

      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'documents',
      loadChildren: () => import('./accounts-documents/accounts-documents.module').then(m => m.AccountsDocumentsModule),
      data: {animation: 'Tab1', preload: true}

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
