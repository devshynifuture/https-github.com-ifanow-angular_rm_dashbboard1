import { GmailDatePipe } from './../Email/email-component/email-list/email-listing/gmail-date.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTasksComponent } from './crm-tasks/add-tasks/add-tasks.component';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirectiveModule } from '../../../../common/directives/common-directive.module';



@NgModule({
  declarations: [
    AddTasksComponent,
    GmailDatePipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ],
  entryComponents: [AddTasksComponent]
})
export class ActivitesEntryModule { }
