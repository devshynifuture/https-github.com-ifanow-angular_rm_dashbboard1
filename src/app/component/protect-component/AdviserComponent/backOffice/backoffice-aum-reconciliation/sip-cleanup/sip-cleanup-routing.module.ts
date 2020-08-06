import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SipCleanupComponent }  from './sip-cleanup.component';

const routes: Routes = [
  {
    path: '',
    component: SipCleanupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SipCleanupRoutingModule { }
