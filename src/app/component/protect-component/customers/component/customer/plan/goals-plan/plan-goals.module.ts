import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanGoalsRoutingModule } from './plan-goals-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { GoalsPlanComponent } from './goals-plan.component';


@NgModule({
  declarations: [GoalsPlanComponent],
  imports: [
    CommonModule,
    PlanGoalsRoutingModule,
    MaterialModule
  ]
})
export class PlanGoalsModule { }
