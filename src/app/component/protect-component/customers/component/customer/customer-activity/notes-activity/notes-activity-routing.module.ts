import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesActivityComponent } from './notes-activity.component';


const routes: Routes = [
  {
    path: '',
    component: NotesActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesActivityRoutingModule { }
