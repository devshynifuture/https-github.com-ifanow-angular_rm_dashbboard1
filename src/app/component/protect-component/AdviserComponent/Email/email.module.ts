import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponentComponent } from './email-component/email-component.component';
import { LeftSidebarComponent } from './email-component/left-sidebar/left-sidebar.component';
import { EmailListComponent } from './email-component/email-list/email-list.component';

import { MaterialModule } from './../../../../material/material';


@NgModule({
  declarations: [EmailComponentComponent, LeftSidebarComponent, EmailListComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class EmailModule { }
