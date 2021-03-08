import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KycRedirectComponent } from './kyc-redirect/kyc-redirect.component';


const routes: Routes = [
  {
    path: '',
    component: KycRedirectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KycRedirectRoutingModule { }
