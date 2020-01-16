import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocumentExplorerComponent} from '../documents/document-explorer.component';

const routes: Routes = [{path: '', component: DocumentExplorerComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsDocumentsRoutingModule {
}
