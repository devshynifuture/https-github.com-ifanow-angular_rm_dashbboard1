import { MaterialModule } from './../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GmailRedirectRoutingModule } from './gmail-redirect-routing.module';
import { GmailRedirectComponent } from './gmail-redirect.component';


@NgModule({
  declarations: [GmailRedirectComponent],
  imports: [
    CommonModule,
    MaterialModule,
    GmailRedirectRoutingModule
  ]
})
export class GmailRedirectModule {
}
