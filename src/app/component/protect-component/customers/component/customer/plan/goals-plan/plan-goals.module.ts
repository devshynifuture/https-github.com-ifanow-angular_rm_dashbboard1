import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanGoalsRoutingModule } from './plan-goals-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { GoalsPlanComponent } from './goals-plan.component';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [GoalsPlanComponent],
  imports: [
    CommonModule,
    PlanGoalsRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
    DragDropModule
  ]
})
export class PlanGoalsModule { }
