import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BackofficeFileUploadComponent} from './backoffice-file-upload.component';
import {BackofficeFileUploadTransactionsComponent} from './backoffice-file-upload-transactions/backoffice-file-upload-transactions.component';
import {BackofficeFileUploadSipStpComponent} from './backoffice-file-upload-sip-stp/backoffice-file-upload-sip-stp.component';
import {BackofficeFileUploadFolioComponent} from './backoffice-file-upload-folio/backoffice-file-upload-folio.component';

const routes: Routes = [
  {
    path: '',
    component: BackofficeFileUploadComponent,
    children: [
      {
        path: 'transaction',
        component: BackofficeFileUploadTransactionsComponent
      },
      {
        path: 'sip-stp',
        component: BackofficeFileUploadSipStpComponent
      },
      {
        path: 'folio',
        component: BackofficeFileUploadFolioComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeFileUploadRoutingModule {
}

export const adminRoutingComponents =
  [
    BackofficeFileUploadComponent,
    BackofficeFileUploadTransactionsComponent,
    BackofficeFileUploadSipStpComponent,
    BackofficeFileUploadFolioComponent
  ];
