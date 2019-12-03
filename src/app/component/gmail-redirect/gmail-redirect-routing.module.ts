import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {GmailRedirectComponent} from './gmail-redirect.component';

const routes: Routes = [{path: '', component: GmailRedirectComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GmailRedirectRoutingModule {
}
