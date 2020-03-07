import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewProfileComponent } from './overview-profile.component';

const routes: Routes = [{ path: '', component: OverviewProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewProfileRoutingModule { }
