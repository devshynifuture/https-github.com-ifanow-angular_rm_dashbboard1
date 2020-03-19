import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewSubscriptionComponent } from './overview-subscription.component';

const routes: Routes = [{ path: '', component: OverviewSubscriptionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewSubscriptionRoutingModule { }
