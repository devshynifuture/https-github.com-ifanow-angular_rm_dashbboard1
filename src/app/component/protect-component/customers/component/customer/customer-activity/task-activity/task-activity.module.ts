import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskActivityRoutingModule } from './task-activity-routing.module';
import { TaskActivityComponent } from './task-activity.component';


@NgModule({
  declarations: [TaskActivityComponent],
  imports: [
    CommonModule,
    TaskActivityRoutingModule
  ]
})
export class TaskActivityModule { }
