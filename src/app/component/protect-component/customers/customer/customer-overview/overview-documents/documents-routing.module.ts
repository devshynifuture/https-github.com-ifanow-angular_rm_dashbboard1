import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentExplorerComponent } from './document-explorer.component';


const routes: Routes = [{ path: '', component: DocumentExplorerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
