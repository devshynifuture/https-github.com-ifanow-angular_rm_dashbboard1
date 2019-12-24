import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsLiabilitiesComponent } from './accounts-liabilities.component';
import { LiabilitiesComponent } from '../liabilities/liabilities.component';

const routes: Routes = [{ path: '', component: LiabilitiesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsLiabilitiesRoutingModule { }
