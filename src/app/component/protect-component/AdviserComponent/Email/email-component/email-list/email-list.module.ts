import { EmailListComponent } from './email-list.component';
import { EmailViewComponent } from './email-view/email-view.component';
import { MaterialModule } from './../../../../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailListRoutingModule } from './email-list-routing.module';
import { EmailListingComponent } from './email-listing/email-listing.component';

import { EmailReplyComponent } from './email-reply/email-reply.component';


@NgModule({
  declarations: [
    EmailListComponent,
    EmailListingComponent,
    EmailReplyComponent,
    EmailViewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmailListRoutingModule
  ]
})
export class EmailListModule { }
