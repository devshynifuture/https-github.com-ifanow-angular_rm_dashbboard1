import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketplaceHomeComponent } from './marketplace-home.component';

const routes: Routes = [{ path: '', component: MarketplaceHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceHomeRoutingModule { }
