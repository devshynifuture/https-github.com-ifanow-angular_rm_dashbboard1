import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerActivityComponent } from './customer-activity.component';

const routes: Routes = [{ path: '', component: CustomerActivityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerActivityRoutingModule { }
