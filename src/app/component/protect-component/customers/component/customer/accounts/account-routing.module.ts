import {DocumentsComponent} from './documents/documents.component';
import {InsuranceComponent} from './insurance/insurance.component';
import {LiabilitiesComponent} from './liabilities/liabilities.component';
import {AssetsComponent} from './assets/assets.component';
import {SummaryComponent} from './summary/summary.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountsComponent} from "./accounts.component";
// import {CustomerComponent} from './component/customer/customer.component';


const routes: Routes = [{
  path: '',
  component: AccountsComponent,
  children: [
    {
      path: 'summary',
      component: SummaryComponent,
      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'assets',
      component: AssetsComponent,
      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'liabilities',
      component: LiabilitiesComponent,
      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'insurance',
      component: InsuranceComponent,
      // outlet: 'accountRouterOutlet'
    },
    {
      path: 'documents',
      component: DocumentsComponent,
      // outlet: 'accountRouterOutlet'
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
