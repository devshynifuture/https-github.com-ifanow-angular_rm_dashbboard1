import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTasksComponent } from './crm-tasks/add-tasks/add-tasks.component';
import { MaterialModule } from 'src/app/material/material';



@NgModule({
  declarations: [AddTasksComponent],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  entryComponents: [AddTasksComponent]
})
export class ActivitesEntryModule { }
