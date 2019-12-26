import { DocumentsComponent } from './documents/documents.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { AssetsComponent } from './assets/assets.component';
import { SummaryComponent } from './summary/summary.component';
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
      loadChildren: () => import('./accounts-summary/accounts-summary.module').then(m => m.AccountsSummaryModule),
      data: { animation: 'Tab1' }
      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'assets',
      loadChildren: () => import('./account-assets/account-assets.module').then(m => m.AccountAssetsModule),
      data: { animation: 'Tab2' }

      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'liabilities',
      loadChildren: () => import('./accounts-liabilities/accounts-liabilities.module').then(m => m.AccountsLiabilitiesModule)
      // outlet: 'accountRouterOutlet'

    },
    {
      path: 'insurance',
      loadChildren: () => import('./accounts-insurance/accounts-insurance.module').then(m => m.AccountsInsuranceModule)
      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'documents',
      loadChildren: () => import('./accounts-documents/accounts-documents.module').then(m => m.AccountsDocumentsModule)
      // outlet: 'accountRouterOutlet'
    }
  ],
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
