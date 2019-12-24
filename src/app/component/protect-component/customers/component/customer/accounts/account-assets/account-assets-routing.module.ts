import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountAssetsComponent } from './account-assets.component';
import { AssetsComponent } from '../assets/assets.component';

const routes: Routes = [{ path: '', component: AssetsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountAssetsRoutingModule { }
