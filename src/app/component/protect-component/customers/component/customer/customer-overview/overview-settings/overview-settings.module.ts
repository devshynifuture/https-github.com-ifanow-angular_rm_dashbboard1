import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewSettingsRoutingModule } from './overview-settings-routing.module';
import { OverviewSettingsComponent } from './overview-settings.component';


@NgModule({
  declarations: [OverviewSettingsComponent],
  imports: [
    CommonModule,
    OverviewSettingsRoutingModule
  ]
})
export class OverviewSettingsModule { }
