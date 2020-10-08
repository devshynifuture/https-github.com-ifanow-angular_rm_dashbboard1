import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadWebPageComponent } from './lead-web-page.component';


const routes: Routes = [
  {
    path: '',
    component: LeadWebPageComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingWebPageRoutingModule {  }