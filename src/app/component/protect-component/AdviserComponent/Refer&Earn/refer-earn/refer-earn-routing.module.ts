import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefersComponent } from './refers/refers.component';


const routes: Routes = [
  {
    path: '',
    component: RefersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferEarnRoutingModule { }
