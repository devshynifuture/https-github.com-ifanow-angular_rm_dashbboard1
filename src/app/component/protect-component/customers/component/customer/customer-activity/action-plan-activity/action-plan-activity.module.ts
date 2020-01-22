import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionPlanActivityRoutingModule } from './action-plan-activity-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActionPlanActivityComponent } from './action-plan-activity.component';


@NgModule({
  declarations: [ActionPlanActivityComponent],
  imports: [
    CommonModule,
    ActionPlanActivityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ActionPlanActivityModule { }
