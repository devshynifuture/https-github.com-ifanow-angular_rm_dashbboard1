import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewSubscriptionRoutingModule } from './overview-subscription-routing.module';
import { OverviewSubscriptionComponent } from './overview-subscription.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ClientInvociesComponent } from './invocies/invocies.component';
import { ClientDocumentsComponent } from './documents/documents.component';
import { ClientSettingsComponent } from './settings/settings.component';
import { SubscriptionUpperEntry } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-upper-entry-module';


@NgModule({
  declarations: [OverviewSubscriptionComponent, SubscriptionsComponent, ClientInvociesComponent, ClientDocumentsComponent, ClientSettingsComponent],
  imports: [
    CommonModule,
    SubscriptionUpperEntry,
    OverviewSubscriptionRoutingModule
  ]
})
export class OverviewSubscriptionModule { }
