import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './../../../../material/material';
import { CommonComponentModule } from './../../common-component/common-component.module';
import { EmailArchiveComponent } from './email-component/email-archive/email-archive.component';
import { EmailDraftComponent } from './email-component/email-draft/email-draft.component';
import { EmailListModule } from './email-component/email-list/email-list.module';
import { EmailSentComponent } from './email-component/email-sent/email-sent.component';
import { EmailTrashComponent } from './email-component/email-trash/email-trash.component';
import { EmailComponent } from './email-component/email.component';
import { LeftSidebarComponent } from './email-component/left-sidebar/left-sidebar.component';
import { EmailRoutingModule } from './email-routing.module';
import { EmailEntryModule } from './email.entry.module';
import { CalenderComponent } from './calender/calender.component';



@NgModule({
  declarations: [
    EmailComponent,
    LeftSidebarComponent,
    EmailSentComponent,
    EmailDraftComponent,
    EmailArchiveComponent,
    EmailTrashComponent,
    CalenderComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonComponentModule,
    EmailListModule,
    EmailRoutingModule,
    FormsModule,
    EmailEntryModule
  ],
  exports: [
  ]
})
export class EmailModule { }
