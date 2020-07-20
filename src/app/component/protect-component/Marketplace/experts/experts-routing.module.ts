import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpertsComponent } from './experts.component';

const routes: Routes = [{ path: '', component: ExpertsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpertsRoutingModule { }
