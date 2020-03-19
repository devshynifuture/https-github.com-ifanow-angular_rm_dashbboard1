import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewSettingsComponent } from './overview-settings.component';

const routes: Routes = [{ path: '', component: OverviewSettingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewSettingsRoutingModule { }
