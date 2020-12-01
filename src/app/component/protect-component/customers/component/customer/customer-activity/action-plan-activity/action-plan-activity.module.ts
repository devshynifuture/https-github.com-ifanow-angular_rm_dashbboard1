import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { MaterialModule } from 'src/app/material/material';
import { AdviceActivityModule } from '../advice-activity/advice-activity.module';
import { ActionPlanActivityRoutingModule } from './action-plan-activity-routing.module';
import { ActionPlanActivityComponent } from './action-plan-activity.component';



@NgModule({
  declarations: [ActionPlanActivityComponent,
  ],
  imports: [
    CommonModule,
    ActionPlanActivityRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CustomDirectiveModule,
    AdviceActivityModule
  ]
})
export class ActionPlanActivityModule { }
