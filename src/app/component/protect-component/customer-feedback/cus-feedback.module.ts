import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CusFeedbackRoutingModule } from './cus-feedback-routing.module';
import { EmailConsentComponent } from './email-consent/email-consent.component';
import { MaterialModule } from 'src/app/material/material';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';



@NgModule({
  declarations: [EmailConsentComponent],
  imports: [
    CommonModule,
    CusFeedbackRoutingModule,
    MaterialModule,
    CustomDirectiveModule
  ]
})
export class CusFeedbackModule { }
