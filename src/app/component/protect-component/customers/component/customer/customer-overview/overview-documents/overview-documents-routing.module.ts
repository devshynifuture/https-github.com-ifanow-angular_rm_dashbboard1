import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewDocumentsComponent } from './overview-documents.component';

const routes: Routes = [{ path: '', component: OverviewDocumentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewDocumentsRoutingModule { }
