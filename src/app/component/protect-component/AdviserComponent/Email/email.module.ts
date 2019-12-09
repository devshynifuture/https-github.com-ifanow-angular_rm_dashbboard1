import { CommonComponentModule } from './../../common-component/common-component.module';
import { FroalaComponent } from './../../common-component/froala/froala.component';
import { FormsModule } from '@angular/forms';
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
import { EmailAddTaskComponent } from './email-component/email-list/email-add-task/email-add-task.component';
import { ComposeEmailComponent } from './email-component/compose-email/compose-email.component';


@NgModule({
  declarations: [
    EmailComponent,
    LeftSidebarComponent,
    EmailSentComponent,
    EmailDraftComponent,
    EmailArchiveComponent,
    EmailTrashComponent,
    EmailAddTaskComponent,
    ComposeEmailComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmailListModule,
    EmailRoutingModule,
    CommonComponentModule,
    FormsModule
  ],
  exports: [
    EmailAddTaskComponent,
    ComposeEmailComponent
  ]
})
export class EmailModule { }
