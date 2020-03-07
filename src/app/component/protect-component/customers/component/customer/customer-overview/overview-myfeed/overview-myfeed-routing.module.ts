import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewMyfeedComponent } from './overview-myfeed.component';

const routes: Routes = [{ path: '', component: OverviewMyfeedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewMyfeedRoutingModule { }
