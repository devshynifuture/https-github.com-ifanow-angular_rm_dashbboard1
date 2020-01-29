import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ClientSubscriptionComponent } from './subscription/client-subscription/client-subscription.component';
import { SubscriptionsSubscriptionComponent } from './subscription/subscriptions-subscription/subscriptions-subscription.component';
import { QuotationsSubscriptionComponent } from './subscription/quotations-subscription/quotations-subscription.component';
import { InvoicesSubscriptionComponent } from './subscription/invoices-subscription/invoices-subscription.component';
import { DocumentsSubscriptionsComponent } from './subscription/documents-subscriptions/documents-subscriptions.component';
import { SettingsSubscriptionComponent } from './subscription/settings-subscription/settings-subscription.component';
import { DashboardSubscriptionComponent } from './subscription/dashboard-subscription/dashboard-subscription.component';


const routes: Routes = [{
  path: '',
  component: SubscriptionComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardSubscriptionComponent,
    },
    {
      path: 'clients',
      component: ClientSubscriptionComponent
    },
    {
      path: 'subscriptions',
      component: SubscriptionsSubscriptionComponent
    },
    {
      path: 'quotations',
      component: QuotationsSubscriptionComponent
    },
    {
      path: 'invoices',
      component: InvoicesSubscriptionComponent
    },
    {
      path: 'documents',
      component: DocumentsSubscriptionsComponent
    },
    {
      path: 'settings',
      component: SettingsSubscriptionComponent
    },
    /* {
       path: 'clients',
       component: CustomerComponent
     }*/]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule {
}
