import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewProfileRoutingModule } from './overview-profile-routing.module';
import { OverviewProfileComponent } from './overview-profile.component';
import { MaterialModule } from 'src/app/material/material';
import { OverviewRiskProfileComponent } from './overview-risk-profile/overview-risk-profile.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';



@NgModule({
  declarations: [OverviewProfileComponent, OverviewRiskProfileComponent],
  imports: [
    CommonModule,
    OverviewProfileRoutingModule,
    MaterialModule,
    CustomDirectiveModule
  ]
})
export class OverviewProfileModule { }
