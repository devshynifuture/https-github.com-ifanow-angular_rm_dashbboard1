import { CustomDirectiveModule } from './../../../../../../../common/directives/common-directive.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanSummaryRoutingModule } from './plan-summary-routing.module';
import { SummaryPlanComponent } from './summary-plan.component';
import { MaterialModule } from 'src/app/material/material';


@NgModule({
  declarations: [SummaryPlanComponent],
  imports: [
    CommonModule,
    PlanSummaryRoutingModule,
    MaterialModule,
    CustomDirectiveModule
  ]
})
export class PlanSummaryModule { }
