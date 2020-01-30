import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileOrderingUploadComponent } from './file-ordering-upload.component';
import { FileOrderingHistoricalComponent } from './file-ordering-historical/file-ordering-historical.component';
import { FileOrderingBulkComponent } from './file-ordering-bulk/file-ordering-bulk.component';


const routes: Routes = [
  {
    path: '',
    component: FileOrderingUploadComponent,
    children: [
      {
        path: 'historical',
        component: FileOrderingHistoricalComponent
      },
      {
        path: 'bulk',
        component: FileOrderingBulkComponent
      },
      {
        path: '',
        redirectTo: 'historical',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileOrderingUploadRoutingModule { }
