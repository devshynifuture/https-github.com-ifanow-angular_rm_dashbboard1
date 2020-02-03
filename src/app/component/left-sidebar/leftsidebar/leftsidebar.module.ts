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
    TransactionsModule,
    TransactionEntryModule
  ],
  entryComponents: [SubscriptionEntry.getComponentList()],
  providers: [DynamicComponentService]
  // providers: [DynamicComponentService]
})
export class LeftsidebarModule {
}
