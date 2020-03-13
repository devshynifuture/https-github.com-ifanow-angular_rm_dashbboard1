import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewProfileRoutingModule } from './overview-profile-routing.module';
import { OverviewProfileComponent } from './overview-profile.component';


@NgModule({
  declarations: [OverviewProfileComponent],
  imports: [
    CommonModule,
    OverviewProfileRoutingModule

  ]
})
export class OverviewProfileModule { }
