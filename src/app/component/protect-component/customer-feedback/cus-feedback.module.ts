import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CusFeedbackRoutingModule } from './cus-feedback-routing.module';
import { EmailConsentComponent } from './email-consent/email-consent.component';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DetailedViewInsurancePlanningComponent } from '../customers/component/customer/plan/insurance-plan/detailed-view-insurance-planning/detailed-view-insurance-planning.component';
import { EntryComponentsModule } from 'src/app/entry.components.module';
import { DialogDetailedViewInsPlanningComponent } from '../customers/component/customer/plan/insurance-plan/dialog-detailed-view-ins-planning/dialog-detailed-view-ins-planning.component';



@NgModule({
  declarations: [EmailConsentComponent],
  imports: [
    CommonModule,
    CusFeedbackRoutingModule,
    MaterialModule,
    CustomDirectiveModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    EntryComponentsModule
  ],
  entryComponents: [DialogDetailedViewInsPlanningComponent]
})
export class CusFeedbackModule { }
