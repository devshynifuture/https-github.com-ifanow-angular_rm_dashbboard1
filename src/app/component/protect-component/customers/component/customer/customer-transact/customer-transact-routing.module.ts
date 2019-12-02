import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerTransactComponent } from './customer-transact.component';

const routes: Routes = [{ path: '', component: CustomerTransactComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerTransactRoutingModule { }
