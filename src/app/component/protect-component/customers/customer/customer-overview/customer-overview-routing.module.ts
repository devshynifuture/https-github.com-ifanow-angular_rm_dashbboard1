import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerOverviewComponent } from './customer-overview.component';

const routes: Routes = [
  {
    path: '', component: CustomerOverviewComponent,
    children: [
      {
        path: 'documents',
        loadChildren: () => import('./overview-documents/documents.module').then(m => m.DocumentsModule)
      },
      {
        path: '',
        redirectTo: 'myfeed',
        pathMatch: 'full'
      },
    ],
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerOverviewRoutingModule {
}
