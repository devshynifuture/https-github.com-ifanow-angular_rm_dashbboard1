import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiviesComponent } from './activies.component';
import { AdviceComponent } from '../advice/advice.component';

const routes: Routes = [{ path: '', component: AdviceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiviesRoutingModule { }
