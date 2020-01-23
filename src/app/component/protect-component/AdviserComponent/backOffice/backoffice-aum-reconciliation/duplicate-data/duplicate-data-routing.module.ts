import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DuplicateDataComponent } from './duplicate-data.component';


const routes: Routes = [
  {
    path: '',
    component: DuplicateDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DuplicateDataRoutingModule { }
