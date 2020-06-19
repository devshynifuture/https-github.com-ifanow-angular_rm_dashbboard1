import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewSubscriptionComponent } from './overview-subscription.component';
import { ClientSettingsComponent } from './settings/settings.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ClientInvociesComponent } from './invocies/invocies.component';
import { ClientDocumentsComponent } from './documents/documents.component';
import { ClientQuotationsComponent } from './client-quotations/client-quotations.component';

const routes: Routes = [{
  path: '', 
  component: OverviewSubscriptionComponent,
  children: [
    {
      path: 'subscriptions',
      component: SubscriptionsComponent
    },
    {
      path: 'settings',
      component: ClientSettingsComponent
    },
    {
      path: 'invoices',
      component: ClientInvociesComponent
    },
    {
      path: 'documents',
      component: ClientDocumentsComponent
    },
    {
      path: 'quotations',
      component: ClientQuotationsComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewSubscriptionRoutingModule { }
