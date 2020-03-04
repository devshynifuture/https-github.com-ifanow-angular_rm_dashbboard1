import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsurancePlanRoutingModule } from './insurance-plan-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { AllInsurancelistComponent } from './mainInsuranceScreen/all-insurancelist/all-insurancelist.component';
import { LifeInsuranceComponent } from './mainInsuranceScreen/life-insurance/life-insurance.component';



@NgModule({
  declarations: [AllInsurancelistComponent,LifeInsuranceComponent],
  imports: [
    CommonModule,
    InsurancePlanRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
  ],
  entryComponents: []
})
export class InsurancePlanModule { }
