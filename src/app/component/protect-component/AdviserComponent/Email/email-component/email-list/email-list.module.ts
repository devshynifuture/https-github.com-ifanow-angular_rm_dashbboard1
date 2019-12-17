import { EmailListComponent } from './email-list.component';
import { EmailViewComponent } from './email-view/email-view.component';
import { MaterialModule } from './../../../../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailListRoutingModule } from './email-list-routing.module';
import { EmailListingComponent } from './email-listing/email-listing.component';

import { EmailReplyComponent } from './email-reply/email-reply.component';
import { GmailDatePipe } from './email-listing/gmail-date.pipe';
import { TruncateStringPipe } from 'src/app/truncate.pipe';
import { ShowListActionsDirective } from './email-listing/show-list-actions.directive';



@NgModule({
  declarations: [
    EmailListComponent,
    EmailListingComponent,
    EmailReplyComponent,
    EmailViewComponent,
    GmailDatePipe,
    TruncateStringPipe,
    ShowListActionsDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmailListRoutingModule
  ],
  exports: [
    GmailDatePipe,
    TruncateStringPipe
  ]
})
export class EmailListModule { }
