import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewProfileRoutingModule } from './overview-profile-routing.module';
import { OverviewProfileComponent } from './overview-profile.component';
import { MaterialModule } from 'src/app/material/material';
import { OverviewRiskProfileComponent } from './overview-risk-profile/overview-risk-profile.component';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { AgePopupComponent } from './age-popup/age-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';


@NgModule({
  declarations: [OverviewProfileComponent, OverviewRiskProfileComponent, AgePopupComponent],
  imports: [
    CommonModule,
    OverviewProfileRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [AgePopupComponent],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class OverviewProfileModule { }
