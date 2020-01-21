import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskActivityComponent } from './task-activity.component';


const routes: Routes = [
  {
    path: '',
    component: TaskActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskActivityRoutingModule { }
