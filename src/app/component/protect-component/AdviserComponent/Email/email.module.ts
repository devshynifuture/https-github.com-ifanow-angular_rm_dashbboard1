import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../../../material/material';
import { CommonComponentModule } from './../../common-component/common-component.module';
// import {EmailArchiveComponent} from './email-component/email-archive/email-archive.component';
// import {EmailDraftComponent} from './email-component/email-draft/email-draft.component';
import { EmailListModule } from './email-component/email-list/email-list.module';
// import {EmailSentComponent} from './email-component/email-sent/email-sent.component';
// import {EmailTrashComponent} from './email-component/email-trash/email-trash.component';
import { EmailComponent } from './email-component/email.component';
import { LeftSidebarComponent } from './email-component/left-sidebar/left-sidebar.component';
import { EmailRoutingModule } from './email-routing.module';
import { EmailEntryModule } from './email.entry.module';

// import { GoogleConnectDialogComponent } from './email-component/google-connect-dialog/google-connect-dialog.component';
import { EmailSettingsComponent } from './email-component/email-settings/email-settings.component';
import { HttpCancelService } from '../../../../services/http-cancel.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ManageHttpInterceptor } from '../../../../Interceptor/manage-http.interceptor';


@NgModule({
  declarations: [
    EmailComponent,
    LeftSidebarComponent,
    EmailSettingsComponent,
    // EmailSentComponent,
    // EmailDraftComponent,
    // EmailArchiveComponent,
    // EmailTrashComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonComponentModule,
    EmailListModule,
    EmailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    EmailEntryModule,
  ],
  exports: [
    EmailListModule,
    EmailEntryModule,
    LeftSidebarComponent
  ],
  providers: [
    HttpCancelService,
    { provide: HTTP_INTERCEPTORS, useClass: ManageHttpInterceptor, multi: true }
  ]
})
export class EmailModule { }
