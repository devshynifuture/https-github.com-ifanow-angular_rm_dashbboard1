import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsurancePlanRoutingModule } from './insurance-plan-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { AllInsurancelistComponent } from './mainInsuranceScreen/all-insurancelist/all-insurancelist.component';
import { LifeInsuranceComponent } from './mainInsuranceScreen/life-insurance/life-insurance.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';




@NgModule({
  declarations: [AllInsurancelistComponent, LifeInsuranceComponent],
  imports: [
    CommonModule,
    InsurancePlanRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
  ],
  entryComponents: [],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class InsurancePlanModule { }
