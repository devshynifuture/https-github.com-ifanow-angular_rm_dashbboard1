import { NgModule } from '@angular/core';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { MaterialModule } from '../material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressButtonComponent } from './progress-button/progress-button.component';
import { CustomDirectiveModule } from "./directives/common-directive.module";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { LinkBankComponent } from './link-bank/link-bank.component';
import { EmailDomainAutoSuggestComponent } from './email-domain-auto-suggest/email-domain-auto-suggest.component';
import { GoogleConnectComponent } from '../component/protect-component/AdviserComponent/Email/email-component/email-list/email-listing/google-connect/google-connect.component';

@NgModule({
  declarations: [
    DialogContainerComponent,
    ProgressButtonComponent,
    LinkBankComponent,
    EmailDomainAutoSuggestComponent,
    GoogleConnectComponent
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    CustomDirectiveModule,
  ],
  exports: [
    DialogContainerComponent, 
    ProgressButtonComponent, 
    LinkBankComponent,
    EmailDomainAutoSuggestComponent,
    GoogleConnectComponent
  ],
  entryComponents: [LinkBankComponent]
})
export class CustomCommonModule {
}
