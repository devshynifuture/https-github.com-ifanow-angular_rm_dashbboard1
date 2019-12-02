import { DocumentsComponent } from './documents/documents.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { AssetsComponent } from './assets/assets.component';
import { SummaryComponent } from './summary/summary.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from "./accounts.component";
// import {CustomerComponent} from './component/customer/customer.component';


const routes: Routes = [{
  path: '',
  component: AccountsComponent,
  children: [
    {
      path: 'summary',
      component: SummaryComponent
    },
    {
      path: 'assets',
      component: AssetsComponent
    },
    {
      path: 'liabilities',
      component: LiabilitiesComponent
    },
    {
      path: 'insurance',
      component: InsuranceComponent
    },
    {
      path: 'documents',
      component: DocumentsComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
