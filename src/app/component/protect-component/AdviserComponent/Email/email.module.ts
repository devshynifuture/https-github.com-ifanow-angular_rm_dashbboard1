import { EmailListModule } from './email-component/email-list/email-list.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailComponent } from './email-component/email.component';
import { LeftSidebarComponent } from './email-component/left-sidebar/left-sidebar.component';
import { EmailListComponent } from './email-component/email-list/email-list.component';
import { EmailRoutingModule } from './email-routing.module';
import { MaterialModule } from './../../../../material/material';
import { EmailSentComponent } from './email-component/email-sent/email-sent.component';
import { EmailDraftComponent } from './email-component/email-draft/email-draft.component';
import { EmailArchiveComponent } from './email-component/email-archive/email-archive.component';
import { EmailTrashComponent } from './email-component/email-trash/email-trash.component';


@NgModule({
  declarations: [
    EmailComponent,
    LeftSidebarComponent,
    EmailSentComponent,
    EmailDraftComponent,
    EmailArchiveComponent,
    EmailTrashComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmailListModule,
    EmailRoutingModule
  ]
})
export class EmailModule { }
