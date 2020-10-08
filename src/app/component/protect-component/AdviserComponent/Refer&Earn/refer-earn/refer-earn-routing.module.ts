import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefersComponent } from './refers/refers.component';
import { HintComponent } from './hint/hint.component';
import { ReferComponent } from './refer/refer.component';


const routes: Routes = [
  {
    path: '',
    component: RefersComponent,
    children: [
      {
        path: 'refer',
        component: ReferComponent
      }, {
        path: 'hint',
        component: HintComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferEarnRoutingModule { }
