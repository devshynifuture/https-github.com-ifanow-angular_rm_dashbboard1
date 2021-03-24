import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientAssignmentComponent } from './client-assignment/client-assignment.component';


const routes: Routes = [
  {
    path: '',
    component: ClientAssignmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientAssignmentRoutingModule { }
