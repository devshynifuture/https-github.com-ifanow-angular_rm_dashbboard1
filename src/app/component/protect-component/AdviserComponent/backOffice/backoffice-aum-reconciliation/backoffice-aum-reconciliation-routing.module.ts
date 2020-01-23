import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BackofficeAumReconciliationComponent } from './backoffice-aum-reconciliation.component';


const routes: Routes = [
  {
    path: '',
    component: BackofficeAumReconciliationComponent,
    children: [
      {
        path: 'reconciliation',
        loadChildren: () => import('./reconciliation/reconciliation.module').then(m => m.ReconciliationModule)
      },
      {
        path: 'duplicate-data',
        loadChildren: () => import('./duplicate-data/duplicate-data.module').then(m => m.DuplicateDataModule)
      },
      {
        path: 'folio-query',
        loadChildren: () => import('./folio-query/folio-query.module').then(m => m.FolioQueryModule)
      },
      {
        path: '',
        redirectTo: 'reconciliation',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeAumReconciliationRoutingModule { }
