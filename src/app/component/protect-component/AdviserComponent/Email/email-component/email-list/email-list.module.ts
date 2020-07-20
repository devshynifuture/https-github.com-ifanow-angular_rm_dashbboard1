import { DateAgoPipe } from './../../../../../../services/date-ago.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailListComponent } from './email-list.component';
import { EmailViewComponent } from './email-view/email-view.component';
import { MaterialModule } from './../../../../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailListRoutingModule } from './email-list-routing.module';
import { EmailListingComponent } from './email-listing/email-listing.component';

import { EmailReplyComponent } from './email-reply/email-reply.component';
import { TruncateStringPipe } from 'src/app/truncate.pipe';
import { ShowListActionsDirective } from './email-listing/show-list-actions.directive';
import { GoogleConnectComponent } from './email-listing/google-connect/google-connect.component';
import { DomSanitizerPipe } from '../../../../../../services/dom-sanitizer.pipe';
import { CustomCommonModule } from 'src/app/common/custom.common.module';
import { CustomDirectiveModule } from 'src/app/common/directives/common-directive.module';




@NgModule({
  declarations: [
    EmailListComponent,
    EmailListingComponent,
    EmailReplyComponent,
    EmailViewComponent,
    TruncateStringPipe,
    DomSanitizerPipe,
    ShowListActionsDirective,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    CustomDirectiveModule,
    ReactiveFormsModule,
    EmailListRoutingModule,
    CustomCommonModule
  ],
  exports: [
    TruncateStringPipe
  ]
})
export class EmailListModule { }
