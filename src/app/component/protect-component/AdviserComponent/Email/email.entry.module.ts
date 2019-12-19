import { CommonComponentModule } from './../../common-component/common-component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material';
import { EmailAddTaskComponent } from './email-component/email-list/email-add-task/email-add-task.component';
import { ComposeEmailComponent } from './email-component/compose-email/compose-email.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


export const componentList = [
  EmailAddTaskComponent,
  ComposeEmailComponent
];

@NgModule({
  declarations: [componentList],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentModule
  ],
  entryComponents: [componentList]
})
export class EmailEntryModule { }
