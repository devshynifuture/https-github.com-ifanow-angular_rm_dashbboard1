import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerOverviewComponent } from './customer-overview.component';

const routes: Routes = [{ path: '', component: CustomerOverviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerOverviewRoutingModule { }
