import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewEmailComponent } from './overview-email.component';

const routes: Routes = [{ path: '', component: OverviewEmailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewEmailRoutingModule { }
