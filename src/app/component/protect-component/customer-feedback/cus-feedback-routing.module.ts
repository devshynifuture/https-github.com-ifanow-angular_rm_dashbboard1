import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailConsentComponent } from './email-consent/email-consent.component';


const routes: Routes = [
  {
    path: 'email-consent',
    component: EmailConsentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CusFeedbackRoutingModule { }
