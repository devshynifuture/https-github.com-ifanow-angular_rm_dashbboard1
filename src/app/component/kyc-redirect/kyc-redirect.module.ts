import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KycRedirectRoutingModule } from './kyc-redirect-routing.module';
import { KycRedirectComponent } from './kyc-redirect/kyc-redirect.component';


@NgModule({
  declarations: [KycRedirectComponent],
  imports: [
    CommonModule,
    KycRedirectRoutingModule
  ]
})
export class KycRedirectModule { }
