import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './email-component/email.component';
import { LeftSidebarComponent } from './email-component/left-sidebar/left-sidebar.component';
import { EmailListComponent } from './email-component/email-list/email-list.component';
import { EmailRoutingModule } from './email-routing.module';
import { MaterialModule } from './../../../../material/material';


@NgModule({
  declarations: [EmailComponent, LeftSidebarComponent, EmailListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    EmailRoutingModule
  ]
})
export class EmailModule { }
