import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResponseHtmlComponent } from './response-html/response-html.component';


const routes: Routes = [{
  path: 'thankYou',
  component: ResponseHtmlComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponseRoutingModule { }
