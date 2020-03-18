import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerOverviewComponent } from './customer-overview.component';

const routes: Routes = [
  {
    path: '', component: CustomerOverviewComponent,
    children: [
      { path: 'myfeed', loadChildren: () => import('./overview-myfeed/overview-myfeed.module').then(m => m.OverviewMyfeedModule) },
      { path: 'profile', loadChildren: () => import('./overview-profile/overview-profile.module').then(m => m.OverviewProfileModule) },
      { path: 'documents', loadChildren: () => import('./overview-documents/documents.module').then(m => m.DocumentsModule) },
      { path: 'email', loadChildren: () => import('./overview-email/overview-email.module').then(m => m.OverviewEmailModule) },
      { path: 'subscription', loadChildren: () => import('./overview-subscription/overview-subscription.module').then(m => m.OverviewSubscriptionModule) },
      { path: 'settings', loadChildren: () => import('./overview-settings/overview-settings.module').then(m => m.OverviewSettingsModule) },
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
export class CustomerOverviewRoutingModule { }
