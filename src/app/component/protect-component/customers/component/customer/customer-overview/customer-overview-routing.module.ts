import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerOverviewComponent } from './customer-overview.component';

const routes: Routes = [
  {
    path: 'customer-overview', component: CustomerOverviewComponent,
    children: [
      { path: 'myfeed', loadChildren: () => import('./overview-myfeed/overview-myfeed.module').then(m => m.OverviewMyfeedModule) },
      { path: 'profile', loadChildren: () => import('./overview-profile/overview-profile.module').then(m => m.OverviewProfileModule) },
      { path: 'documents', loadChildren: () => import('./overview-documents/overview-documents.module').then(m => m.OverviewDocumentsModule) },
      {
        path: '',
        redirectTo: 'myfeed',
        pathMatch: 'full'
      },

    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerOverviewRoutingModule { }
