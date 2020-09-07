import { CommonComponentModule } from './../../common-component/common-component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';
import { EmailAddTaskComponent } from './email-component/email-list/email-add-task/email-add-task.component';
import { ComposeEmailComponent } from './email-component/compose-email/compose-email.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleConnectDialogComponent } from './email-component/google-connect-dialog/google-connect-dialog.component';
import { EmailFaqAndSecurityComponent } from './email-component/email-faq-and-security/email-faq-and-security.component';
import { CustomCommonModule } from 'src/app/common/custom.common.module';

export const componentList = [
  EmailAddTaskComponent,
  ComposeEmailComponent,
  GoogleConnectDialogComponent,
  EmailFaqAndSecurityComponent
];

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentModule,
    CustomCommonModule
  ],
  entryComponents: [componentList]
})
export class EmailEntryModule { }
