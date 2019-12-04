import { MaterialModule } from './../../../../../../material/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailListRoutingModule } from './email-list-routing.module';
import { EmailListingComponent } from './email-listing/email-listing.component';
import { EmailViewComponent } from './email-view/email-view.component';
import { EmailAddTaskComponent } from './email-add-task/email-add-task.component';
import { EmailReplyComponent } from './email-reply/email-reply.component';


@NgModule({
  declarations: [
    EmailListingComponent,
    EmailViewComponent,
    EmailAddTaskComponent,
    EmailViewComponent,
    EmailReplyComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmailListRoutingModule
  ]
})
export class EmailListModule { }
