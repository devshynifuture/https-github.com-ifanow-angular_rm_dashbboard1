import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsurancePlanRoutingModule } from './insurance-plan-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { InsurancePlanComponent } from './insurance-plan.component';


@NgModule({
  declarations: [InsurancePlanComponent],
  imports: [
    CommonModule,
    InsurancePlanRoutingModule,
    MaterialModule,
    CustomDirectiveModule
  ]
})
export class InsurancePlanModule { }
