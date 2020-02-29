import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeftsidebarRoutingModule } from './leftsidebar-routing.module';
import { MaterialModule } from 'src/app/material/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionEntry } from '../../protect-component/AdviserComponent/Subscriptions/subscription.entry.module';
import { SubscriptionUpperEntry } from '../../protect-component/AdviserComponent/Subscriptions/subscription-upper-entry-module';
import { LeftsidebarComponent } from './leftsidebar.component';
import { CalendarModule } from '../../protect-component/AdviserComponent/Activities/calendar/calendar.module';
import { DynamicComponentService } from "../../../services/dynamic-component.service";
import { TransactionsModule } from '../../protect-component/AdviserComponent/transactions/transactions.module';
import { TransactionEntryModule } from '../../protect-component/AdviserComponent/transactions/transaction.entry.module';
import { SupportEntryModule } from '../../protect-component/SupportComponent/support.entry.module';
import { SettingEntryModule } from '../../protect-component/AdviserComponent/setting/setting-entry/setting-entry.module';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

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
    CalendarModule,
    ScrollDispatchModule,
    TransactionsModule,
    TransactionEntryModule,
    SupportEntryModule,
    SettingEntryModule
  ],
  entryComponents: [SubscriptionEntry.getComponentList(), SupportEntryModule.getComponentList(), SettingEntryModule.getComponentList()],
  providers: [DynamicComponentService]
  // providers: [DynamicComponentService]
})
export class LeftsidebarModule {
}
