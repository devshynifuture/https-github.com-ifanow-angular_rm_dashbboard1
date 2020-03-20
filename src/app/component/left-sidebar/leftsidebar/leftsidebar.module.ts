import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeftsidebarRoutingModule } from './leftsidebar-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionEntry } from '../../protect-component/AdviserComponent/Subscriptions/subscription.entry.module';
import { SubscriptionUpperEntry } from '../../protect-component/AdviserComponent/Subscriptions/subscription-upper-entry-module';
import { LeftsidebarComponent } from './leftsidebar.component';
import { DynamicComponentService } from "../../../services/dynamic-component.service";
import { TransactionsModule } from '../../protect-component/AdviserComponent/transactions/transactions.module';
import { TransactionEntryModule } from '../../protect-component/AdviserComponent/transactions/transaction.entry.module';
import { SupportEntryModule } from '../../protect-component/SupportComponent/support.entry.module';
import { SettingEntryModule } from '../../protect-component/AdviserComponent/setting/setting-entry/setting-entry.module';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { PeopleEntryModule } from '../../protect-component/PeopleComponent/people/people-entry-module';
import { ActivitesEntryModule } from '../../protect-component/AdviserComponent/Activities/activites-entry.module';
import { BackofficeAumReconciliationEntryModule } from '../../protect-component/AdviserComponent/backOffice/backoffice-aum-reconciliation/backoffice-aum-reconciliation.entry.module'
@NgModule({
  declarations: [
    LeftsidebarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SubscriptionEntry,
    SubscriptionUpperEntry,
    LeftsidebarRoutingModule,
    ScrollDispatchModule,
    TransactionsModule,
    TransactionEntryModule,
    SupportEntryModule,
    SettingEntryModule,
    PeopleEntryModule,
    ActivitesEntryModule,
    BackofficeAumReconciliationEntryModule
  ],
  entryComponents: [SubscriptionEntry.getComponentList(), SupportEntryModule.getComponentList(), SettingEntryModule.getComponentList(), PeopleEntryModule.getComponentList()],
  providers: [DynamicComponentService]
  // providers: [DynamicComponentService]
})
export class LeftsidebarModule {
}
